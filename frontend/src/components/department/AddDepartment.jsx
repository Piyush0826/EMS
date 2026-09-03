import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config/api";

const AddDepartment = () => {
  const [department, setDepartment] = useState({
    dep_name: "",
    description: ""
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDepartment({ ...department, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!department.dep_name.trim()) {
      alert("Department name is required");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/department/add`,
        department,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (response.data.success) {
        alert("Department added successfully");
        navigate("/admin-dashboard/departments");
      }
    } catch (error) {
      if (error.response) {
        alert(error.response.data.error || "Failed to add department");
      } else {
        alert("Server not reachable. Make sure the backend is running on port 5000");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 mb-8 bg-white p-10 rounded-2xl shadow-lg border border-cyan-100">
      <div className="mb-8">
        <h2 className="text-4xl font-bold font-poppins text-slate-800 mb-2">Add New Department</h2>
        <p className="text-slate-600 font-poppins">Create a new department for your organization</p>
      </div>

      {/* 🔥 FORM MUST HAVE onSubmit */}
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-sm font-semibold font-poppins text-slate-800 mb-2">
            Department Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="dep_name"
            value={department.dep_name}
            onChange={handleChange}
            placeholder="Enter Department Name"
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition duration-200 bg-slate-50 font-poppins"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold font-poppins text-slate-800 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={department.description}
            onChange={handleChange}
            placeholder="Enter department description..."
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition duration-200 bg-slate-50 font-poppins"
            rows="4"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold font-poppins py-3 px-6 rounded-lg disabled:opacity-50 transition duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {loading ? "Adding..." : "Add Department"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin-dashboard/departments")}
            className="flex-1 bg-slate-400 hover:bg-slate-500 text-white font-bold font-poppins py-3 px-6 rounded-lg transition duration-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddDepartment;
