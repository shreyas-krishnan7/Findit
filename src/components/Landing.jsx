import React from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">
          FindIt – Your Lost & Found Solution
        </h1>
        <p className="text-gray-600 mt-2">
          Report lost items, find missing belongings, and contact to people to claim easily.
        </p>
        
      </div>

      {/* How It Works Section */}
      <div className="mt-12 max-w-3xl">
        <h2 className="text-2xl font-bold text-gray-800 text-center">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="p-4 bg-white shadow-md rounded-lg text-center">
            <h3 className="font-semibold text-lg">🔍 Report Lost Item</h3>
            <p className="text-gray-600 text-sm">Describe your lost item and where you last saw it.</p>
          </div>
          <div className="p-4 bg-white shadow-md rounded-lg text-center">
            <h3 className="font-semibold text-lg">📢 Report Found Item</h3>
            <p className="text-gray-600 text-sm">Upload details of found items and help return them.</p>
          </div>
          <div className="p-4 bg-white shadow-md rounded-lg text-center">
            <h3 className="font-semibold text-lg">🤝 View items</h3>
            <p className="text-gray-600 text-sm">View all the Lost and Found items around the campus.</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 text-gray-500 text-sm">
        © {new Date().getFullYear()} Find It. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
