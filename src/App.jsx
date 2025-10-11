import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import NavbarUser from "./components/NavbarUser";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dashboard from "./components/Dashboard";
import ReportLostItem from "./components/ReportLost";
import LostItems from "./components/LostItems";
import ReportFound from "./components/ReportFound";
import FoundItems from "./components/FoundItems";
import MyClaims from "./components/claims";
import LandingPage from "./components/Landing";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      {isLoggedIn ? <NavbarUser /> : <Navbar />}
      
      <Routes>
        <Route path="/" element={isLoggedIn ? <Dashboard /> : <LandingPage/>} />
        <Route path="/report-lost" element={isLoggedIn ? <ReportLostItem /> : <h2>Welcome! Please log in.</h2>} />
        <Route path="/lost-items" element={isLoggedIn ? <LostItems /> : <h2>Welcome! Please log in.</h2>} />
        <Route path="/report-found" element={isLoggedIn ? <ReportFound /> : <h2>Welcome! Please log in.</h2>} />
        <Route path="/found-items" element={isLoggedIn ? <FoundItems /> : <h2>Welcome! Please log in.</h2>} />
        <Route path="/claims" element={isLoggedIn ? <MyClaims /> : <h2>Welcome! Please log in.</h2>} />
      </Routes>
    </>
  );
}

export default App;
