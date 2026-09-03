import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../config/api';

const Add = () => {
    const [departments, setDepartments] = useState([]);
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      password: '',
      employeeId: '',
      dob: '',
      gender: '',
      maritalStatus: '',
      designation: '',
      department: '',
      salary: '',
      image: null,
      phone: '',
      mobile: '',
      address: '',
      city: '',
      state: '',
      country: '',
      zipCode: ''
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        const getDepartments = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/department`, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if(response.data.success) {
                    setDepartments(response.data.departments);
                }
            } catch (error) {
                console.error('Error fetching departments:', error);
            }
        };
        getDepartments();
    }, []);
    const handleChange = (e) => {
        const{name,value,files}= e.target;
        if(name==="image"){
            setFormData((preData)=>({...preData,[name]:files[0] }))
    }else{
        setFormData((preData)=>({...preData,[name]:value }))
    }
    };

 const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name || !formData.email || !formData.password || !formData.department) {
      alert("Please fill in all required fields");
      return;
    }

    // Create FormData object for multipart/form-data
    const submitData = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key]) {
        submitData.append(key, formData[key]);
      }
    });

    setLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/employee/add`,
        submitData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      if (response.data.success) {
        alert("Employee added successfully");
        navigate("/admin-dashboard/employees");
      }
    } catch (error) {
      console.error('Error details:', error);
      if (error.response) {
        console.error('Server error response:', error.response.data);
        alert(error.response.data.error || "Failed to add employee");
      } else if (error.request) {
        console.error('No response received:', error.request);
        alert("No response from server. Make sure the backend is running on port 5000");
      } else {
        console.error('Error message:', error.message);
        alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="max-w-5xl mx-auto mt-8 mb-8 bg-white p-10 rounded-2xl shadow-lg border border-cyan-100">
      <div className="mb-8">
        <h2 className="text-4xl font-bold font-poppins text-slate-800 mb-2">Add New Employee</h2>
        <p className="text-slate-600 font-poppins">Create a new employee profile with all required information</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Name */}
          <div>
            <label className="block text-sm font-semibold font-poppins text-slate-800 mb-2">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Insert Name"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition duration-200 bg-slate-50 font-poppins"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold font-poppins text-slate-800 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Insert Email"
              autoComplete="email"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition duration-200 bg-slate-50 font-poppins"
              required
            />
          </div>

          {/* Employee ID */}
          <div>
            <label className="block text-sm font-semibold font-poppins text-slate-800 mb-2">
              Employee ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              placeholder="Employee ID"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition duration-200 bg-slate-50 font-poppins"
              required
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-semibold font-poppins text-slate-800 mb-2">
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              placeholder="DOB"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition duration-200 bg-slate-50 font-poppins"
              required
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-semibold font-poppins text-slate-800 mb-2">
              Gender <span className="text-red-500">*</span>
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition duration-200 bg-slate-50 font-poppins"
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Marital Status */}
          <div>
            <label className="block text-sm font-semibold font-poppins text-slate-800 mb-2">
              Marital Status <span className="text-red-500">*</span>
            </label>
            <select
              name="maritalStatus"
              value={formData.maritalStatus}
              onChange={handleChange}
              placeholder="Marital Status"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition duration-200 bg-slate-50 font-poppins"
              required
            >
              <option value="">Select Status</option>
              <option value="single">Single</option>
              <option value="married">Married</option>
            </select>
          </div>

          {/* Designation */}
          <div>
            <label className="block text-sm font-semibold font-poppins text-slate-800 mb-2">
              Designation <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              placeholder="Designation"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition duration-200 bg-slate-50 font-poppins"
              required
            />
          </div>

          {/* Department */}
          <div>
            <label className="block text-sm font-semibold font-poppins text-slate-800 mb-2">
              Department <span className="text-red-500">*</span>
            </label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition duration-200 bg-slate-50 font-poppins"
              required
            >
              <option value="">Select Department</option>
                {departments.map((dep) => (
                  <option key={dep._id} value={dep._id}>
                    {dep.dep_name}
                  </option>
                ))}
            </select>
          </div>

          {/* Salary */}
          <div>
            <label className="block text-sm font-semibold font-poppins text-slate-800 mb-2">
              Salary <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              placeholder="Salary"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition duration-200 bg-slate-50 font-poppins"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold font-poppins text-slate-800 mb-2">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              autoComplete="new-password"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition duration-200 bg-slate-50 font-poppins"
              required
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-semibold font-poppins text-slate-800 mb-2">
              Role <span className="text-red-500">*</span>
            </label>
            <select
              name="role"
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition duration-200 bg-slate-50 font-poppins"
              required
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="employee">Employee</option>
            </select>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold font-poppins text-slate-800 mb-2">
              Upload Image
            </label>
            <input
              type="file"
              name="image"
              onChange={handleChange}
              placeholder="Upload Image"
              accept="image/*"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition duration-200 bg-slate-50 font-poppins"
            />
          </div>

          {/* Contact Information Section */}
          <div className="md:col-span-2 mt-6 pt-6 border-t-2 border-gradient-to-r border-cyan-300">
            <h3 className="text-xl font-bold font-poppins text-slate-800 mb-4 flex items-center">
              <span className="w-1 h-6 bg-gradient-to-b from-cyan-500 to-blue-600 rounded mr-3"></span>
              Contact Information
            </h3>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold font-poppins text-slate-800 mb-2">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition duration-200 bg-slate-50 font-poppins"
            />
          </div>

          {/* Mobile */}
          <div>
            <label className="block text-sm font-semibold font-poppins text-slate-800 mb-2">
              Mobile
            </label>
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Mobile Number"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition duration-200 bg-slate-50 font-poppins"
            />
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold font-poppins text-slate-800 mb-2">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Street Address"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition duration-200 bg-slate-50 font-poppins"
            />
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-semibold font-poppins text-slate-800 mb-2">
              City
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="City"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition duration-200 bg-slate-50 font-poppins"
            />
          </div>

          {/* State */}
          <div>
            <label className="block text-sm font-semibold font-poppins text-slate-800 mb-2">
              State
            </label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="State"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition duration-200 bg-slate-50 font-poppins"
            />
          </div>

          {/* Zip Code */}
          <div>
            <label className="block text-sm font-semibold font-poppins text-slate-800 mb-2">
              Zip Code
            </label>
            <input
              type="text"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              placeholder="Zip Code"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition duration-200 bg-slate-50 font-poppins"
            />
          </div>

          {/* Country */}
          <div>
            <label className="block text-sm font-semibold font-poppins text-slate-800 mb-2">
              Country
            </label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="Country"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition duration-200 bg-slate-50 font-poppins"
            />
          </div>

        </div>

        <div className="flex gap-4 mt-8">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold font-poppins py-3 px-6 rounded-lg disabled:opacity-50 transition duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {loading ? "Adding Employee..." : "Add Employee"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin-dashboard/employees")}
            className="flex-1 bg-slate-400 hover:bg-slate-500 text-white font-bold font-poppins py-3 px-6 rounded-lg transition duration-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default Add;  
