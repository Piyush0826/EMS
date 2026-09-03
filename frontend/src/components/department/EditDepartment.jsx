import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';

const EditDepartment = () => {
  const {id} = useParams();
  const [department, setDepartment]=useState([]);
  const [departmentLoading, setDepartmentLoading]=useState(false);
  const navigate = useNavigate();
useEffect(() => {
  const fetchDepartments = async () => {
    setDepartmentLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/department/${id}`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
      })
      if(response.data.success) {
        setDepartment(response.data.department);
       
      }
    } catch (error) {
     if (error.response && !error.response.data.success) {
    alert(error.response.data.error)
     }
  }finally{
    setDepartmentLoading(false);
  }
};
fetchDepartments(); 
}, []);
  const handleChange =async (e) => {
    const { name, value } = e.target;
    setDepartment({ ...department, [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
 
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/department/${id}`,
        department,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (response.data.success) {
        navigate("/admin-dashboard/departments");
      }
       } catch (error) {
          if (error.response && !error.response.data.success) {
           alert(error.response.data.error);
   }
       } finally {
         setDepartmentLoading(false);
        }
 
  };

  return (
    <>
      {departmentLoading ? (
        <div className="flex justify-center items-center h-96">
          <div className="text-slate-600 font-poppins">Loading department...</div>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto mt-8 mb-8 bg-white p-10 rounded-2xl shadow-lg border border-cyan-100">
      <div className="mb-8">
        <h2 className="text-4xl font-bold font-poppins text-slate-800 mb-2">Edit Department</h2>
        <p className="text-slate-600 font-poppins">Update department information</p>
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
            className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold font-poppins py-3 px-6 rounded-lg transition duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Update Department
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin-dashboard/departments')}
            className="flex-1 bg-slate-400 hover:bg-slate-500 text-white font-bold font-poppins py-3 px-6 rounded-lg transition duration-200"
          >
            Cancel
          </button>
        </div>
      </form>
        </div>
      )}
    </>
  )
}

export default EditDepartment