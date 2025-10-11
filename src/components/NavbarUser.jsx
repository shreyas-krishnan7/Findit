import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, Home, Menu, X } from "lucide-react";

const NavbarUser = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    // Dispatch storage event to update app state
    window.dispatchEvent(new Event("storage"));

    // Redirect to home after logout
    navigate("/");
  };

  return (
    <nav className="bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link className="text-2xl font-bold tracking-tight hover:text-blue-400 transition-colors" to="/">
          FindIt
        </Link>

        {/* Hamburger Menu for Mobile */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          <Link className="hover:text-blue-400 transition-colors flex items-center space-x-1" to="/">
            <Home className="w-5 h-5" />
            <span>Home</span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden flex flex-col space-y-3 px-4 pb-4">
          <Link className="hover:text-blue-400 transition-colors flex items-center space-x-1" to="/" onClick={() => setIsOpen(false)}>
            <Home className="w-5 h-5" />
            <span>Home</span>
          </Link>

          <button
            onClick={() => {
              setIsOpen(false);
              handleLogout();
            }}
            className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      )}
    </nav>
  );
};

export default NavbarUser;
