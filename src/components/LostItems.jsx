import React, { useEffect, useState } from "react";

const LostItems = () => {
  const [lostItems, setLostItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLostItems = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/lost-items");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch lost items");
        }

        setLostItems(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLostItems();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Lost Items</h2>

      {loading && <p className="text-gray-500">Loading lost items...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {lostItems.map((item) => (
          <div key={item.id} className="border p-4 rounded-lg shadow">
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
            <p className="text-blue-500 font-medium">
              Reported by: {item.reported_by_name || "Unknown"}
            </p>
            <p className="text-blue-500 font-medium">
              Email: {item.reported_by_email || "Unknown"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LostItems;
