import React from "react";
import { PackageSearch, PackageCheck, Eye, ClipboardList, FilePlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const options = [
    { label: "Report Lost Item", icon: <PackageSearch />, path: "/report-lost" },
    { label: "Report Found Item", icon: <PackageCheck />, path: "/report-found" },
    { label: "See All Lost Items", icon: <Eye />, path: "/lost-items" },
    { label: "See All Found Items", icon: <Eye />, path: "/found-items" },
    { label: "My Reported Items", icon: <ClipboardList />, path: "/claims" },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-4 p-30">
      {options.map((option, index) => (
        <div
          key={index}
          onClick={() => navigate(option.path)}
          className="flex flex-col items-center bg-white p-4 rounded-lg shadow-lg w-48 cursor-pointer hover:shadow-xl transition"
        >
          <div className="bg-blue-100 text-blue-600 p-3 rounded-full">{option.icon}</div>
          <span className="mt-2 text-sm font-medium text-gray-800 text-center">{option.label}</span>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
