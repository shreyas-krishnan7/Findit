import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const MyClaims = () => {
  const [myClaims, setMyClaims] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchMyClaims = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/my-claims", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to fetch claims");

        setMyClaims(data);
      } catch (err) {
        toast.error(err.message);
      }
    };

    fetchMyClaims();
  }, [token]);

  const handleDeleteClaim = async (itemId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/delete-claim/${itemId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
        setMyClaims(myClaims.filter((item) => item.id !== itemId));
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error("Failed to delete claim.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">My Reported Items</h2>
      {myClaims.length === 0 && <p className="text-gray-500">No items reported yet.</p>}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {myClaims.map((item) => (
          <div key={item.id} className="relative border p-4 rounded-lg shadow">
            {/* Tag on the Top-Right */}
            <span
              className={`absolute top-2 right-2 px-3 py-1 text-sm font-semibold text-white rounded ${
                item.category === "lost" ? "bg-red-500" : "bg-green-500"
              }`}
            >
              {item.category === "lost" ? "Lost" : "Found"}
            </span>

            {item.image_url && (
              <img
                src={`http://localhost:5000${item.image_url}`}
                alt={item.name}
                className="w-full h-40 object-cover rounded"
              />
            )}

            <h3 className="text-xl font-semibold mt-2">{item.name}</h3>
            <p className="text-gray-600">{item.description || "No description provided"}</p>
            <p className="text-gray-800 font-bold">Location: {item.location}</p>
            <p className="text-gray-500 text-sm">
              Reported on {new Date(item.date_reported).toLocaleDateString()}
            </p>

            <button
              onClick={() => handleDeleteClaim(item.id)}
              className="mt-2 bg-black text-white py-1 px-3 rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyClaims;
