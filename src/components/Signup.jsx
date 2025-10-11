import React, { useState } from "react";
import { User, Mail, Lock, BookUser, Briefcase, Building, ChevronDown } from "lucide-react";
import { toast } from "react-toastify";

const Signup = ({ onClose }) => {
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    user_role: "student",
    roll_no: "",
    faculty_code: "",
    department: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== confirmPassword) return toast.error("Passwords do not match!");

    const userData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.user_role,
    };

    if (formData.user_role === "student") {
      if (!formData.roll_no) return toast.error("Roll number is required.");
      userData.roll_no = formData.roll_no;
    } else {
      if (!formData.faculty_code) return toast.error("Faculty ID is required.");
      userData.faculty_code = formData.faculty_code;
      userData.department = formData.department || null;
    }

    try {
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const json = await response.json();
      response.ok ? (toast.success("Signup Successful"), onClose && onClose()) : toast.error(json.error);
    } catch (error) {
      toast.error("Signup failed. Try again.");
    }
  };

  return (
    <div className="relative bg-white rounded-lg p-4 w-80 shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-2">
        {/* Name */}
        <div className="flex items-center gap-2">
          <User className="w-4 h-4" />
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name"
            required className="w-full text-sm px-2 py-1 border rounded focus:ring-1 focus:ring-blue-500" />
        </div>

        {/* Role Selection */}
        <div className="flex items-center gap-2">
          <ChevronDown className="w-4 h-4" />
          <select name="user_role" value={formData.user_role} onChange={handleChange} required
            className="w-full text-sm px-2 py-1 border rounded focus:ring-1 focus:ring-blue-500">
            <option value="student">Student</option>
            <option value="faculty">Faculty</option>
          </select>
        </div>

        {/* Roll Number / Faculty ID */}
        {formData.user_role === "student" ? (
          <div className="flex items-center gap-2">
            <BookUser className="w-4 h-4" />
            <input type="text" name="roll_no" value={formData.roll_no} onChange={handleChange} placeholder="Roll Number"
              required className="w-full text-sm px-2 py-1 border rounded focus:ring-1 focus:ring-blue-500" />
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              <input type="text" name="faculty_code" value={formData.faculty_code} onChange={handleChange} placeholder="Faculty ID"
                required className="w-full text-sm px-2 py-1 border rounded focus:ring-1 focus:ring-blue-500" />
            </div>
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4" />
              <input type="text" name="department" value={formData.department} onChange={handleChange} placeholder="Department (Optional)"
                className="w-full text-sm px-2 py-1 border rounded focus:ring-1 focus:ring-blue-500" />
            </div>
          </>
        )}

        {/* Email */}
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4" />
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email"
            required className="w-full text-sm px-2 py-1 border rounded focus:ring-1 focus:ring-blue-500" />
        </div>

        {/* Password */}
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4" />
          <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password"
            required className="w-full text-sm px-2 py-1 border rounded focus:ring-1 focus:ring-blue-500" />
        </div>

        {/* Confirm Password */}
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4" />
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password" required className="w-full text-sm px-2 py-1 border rounded focus:ring-1 focus:ring-blue-500" />
        </div>

        {/* Submit */}
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-1 px-2 rounded transition">
          Create Account
        </button>
      </form>
    </div>
  );
};

export default Signup;
