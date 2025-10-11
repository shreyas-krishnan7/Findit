import React, { useState } from "react";
import { toast } from "react-toastify";
import {jwtDecode} from "jwt-decode";

const ReportFound = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    image: null,
  });

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.location) {
      toast.error("Name and location are required!");
      return;
    }

    // ✅ Get Token from Local Storage
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("User not authenticated!");
      return;
    }

    try {
        // ✅ Decode Token to Extract User ID
        const decoded = jwtDecode(token);
        const userId = decoded.id; // Assuming the payload has `id`
    
        const formDataToSend = new FormData();
        formDataToSend.append("name", formData.name);
        formDataToSend.append("description", formData.description);
        formDataToSend.append("location", formData.location);
        formDataToSend.append("reported_by", userId);
        if (formData.image) {
          formDataToSend.append("image", formData.image);
        }
    
        const response = await fetch("http://localhost:5000/api/report-found", {
          method: "POST",
          headers: {
            Authorization: `${token}`, // ✅ Attach Token in Header
          },
          body: formDataToSend,
        });
    
        const json = await response.json();
        if (response.ok) {
          toast.success(json.message);
          setFormData({ name: "", description: "", location: "", image: null });
        } else {
          toast.error(json.error);
        }
      } catch (error) {
        toast.error("Failed to report found item. Try again.");
      }
    };

  return (
    <div className="p-4 m-3 bg-white shadow-md rounded-lg w-full max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">Report Found Item</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          name="name"
          placeholder="Item Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          required
        />
        <textarea
          name="description"
          placeholder="Description (optional)"
          value={formData.description}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          required
        />
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          className="w-full"
        />
        <button type="submit" className="bg-green-500 text-white py-2 px-4 rounded">
          Submit
        </button>
      </form>
    </div>
  );
};

export default ReportFound;
