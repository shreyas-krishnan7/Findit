import React, { useState } from "react";
import { Lock, BookUser, Briefcase, LogIn } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = ({ onClose }) => {
  const [formData, setFormData] = useState({
    user_role: "student", // Default to student
    id: "", // Roll No for students, Faculty ID for faculty
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const bodyData =
      formData.user_role === "student"
        ? { user_role: "student", roll_no: formData.id, password: formData.password }
        : { user_role: "faculty", faculty_code: formData.id, password: formData.password };

    try {
      console.log("Sending login request:", bodyData); // Debugging

      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      const json = await response.json();
      console.log("Server Response:", json); // Debugging

      if (json.success) {
        localStorage.setItem("token", json.token);
        localStorage.setItem("role", json.role);
        toast.success("Login Successful");
        window.dispatchEvent(new Event("storage"));

        setTimeout(() => navigate("/"), 100);
        setTimeout(() => onClose && onClose(), 100);
      } else {
        toast.error(json.error);
      }
    } catch (error) {
      toast.error("Login failed. Please try again.");
    }
  };

  return (
    <div className="relative bg-white rounded-lg p-6 w-96 shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">Login</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Role Selection */}
        <div>
          <label htmlFor="user_role" className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Briefcase className="w-4 h-4" />
            Select Role
          </label>
          <select id="user_role" name="user_role" value={formData.user_role} onChange={handleChange} required
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition">
            <option value="student">Student</option>
            <option value="faculty">Faculty</option>
          </select>
        </div>

        {/* Roll Number / Faculty ID */}
        <div>
          <label htmlFor="id" className="flex items-center gap-2 text-sm font-medium text-gray-700">
            {formData.user_role === "student" ? <BookUser className="w-4 h-4" /> : <Briefcase className="w-4 h-4" />}
            {formData.user_role === "student" ? "Roll Number" : "Faculty ID"}
          </label>
          <input type="text" id="id" name="id" required onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition" />
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Lock className="w-4 h-4" />
            Password
          </label>
          <input type="password" id="password" name="password" required onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition" />
        </div>

        {/* Submit Button */}
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition">
         Login
        </button>
      </form>
    </div>
  );
};

export default Login;
