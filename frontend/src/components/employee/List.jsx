import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { handleImageError } from '../../utils/EmployeeHelper'
import { API_BASE_URL } from '../../config/api'


const List = () => {
  const [employees, setEmployees] = useState([]);
  const [employeeLoading, setEmployeeLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchEmployees = async () => {
      setEmployeeLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/api/employee`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.data.success) {
          console.log('Raw employee data:', response.data.employees);
          const data = response.data.employees.map((emp, index) => ({
            _id: emp._id,
            sno: index + 1,
            name: emp.userId?.name || 'N/A',
            email: emp.userId?.email || 'N/A',
            profileImage: emp.userId?.profileImage || '',
            employeeId: emp.employeeId,
            designation: emp.designation,
            dob: emp.dob,
            dep_name: emp.department?.dep_name || 'N/A',
            department: emp.department
          }));
          console.log('Mapped employee data:', data);
          setEmployees(data);
        }
      } catch (error) {
        console.error('Error fetching employees:', error);
        if (error.response && !error.response.data.success) {
          alert(error.response.data.error);
        }
      } finally {
        setEmployeeLoading(false);
      }
    };
    fetchEmployees();
  }, []);
  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50 min-h-screen">
      <div className="mb-8">
        <h3 className="text-5xl font-bold font-poppins text-slate-800 mb-2">Manage Employees</h3>
        <p className="text-slate-600 font-poppins">View, edit, and manage all employee information</p>
      </div>

      {/* Search + Add Button */}
      <div className="flex justify-between items-center mb-8 gap-4 flex-wrap">
        <input
          type="text"
          placeholder="Search by Name or Department..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 min-w-0 max-w-md px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition duration-200 bg-white font-poppins"
        />

        <Link
          to="/admin-dashboard/add-employee"
          className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold font-poppins rounded-lg hover:from-cyan-600 hover:to-blue-700 transition duration-200 shadow-lg hover:shadow-xl whitespace-nowrap"
        >
          + Add Employee
        </Link>
      </div>

      {/* Employee Table */}
      {employeeLoading ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-md">
          <div className="inline-block animate-spin">
            <div className="h-8 w-8 border-4 border-cyan-500 border-t-blue-600 rounded-full"></div>
          </div>
          <p className="text-slate-600 font-poppins mt-4">Loading employees...</p>
        </div>
      ) : employees.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-md border border-cyan-100">
          <p className="text-slate-600 font-poppins text-lg">No employees found. Add a new employee to get started.</p>
        </div>
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-xl bg-white border border-cyan-100">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-slate-800 to-slate-900 text-white">
                <th className="px-6 py-4 text-left text-sm font-bold font-poppins">S No</th>
                <th className="px-6 py-4 text-left text-sm font-bold font-poppins">Name</th>
                <th className="px-6 py-4 text-left text-sm font-bold font-poppins">Image</th>
                <th className="px-6 py-4 text-left text-sm font-bold font-poppins">Department</th>
                <th className="px-6 py-4 text-left text-sm font-bold font-poppins">DOB</th>
                <th className="px-6 py-4 text-left text-sm font-bold font-poppins">Action</th>
              </tr>
            </thead>
            <tbody>
              {employees
                .filter((emp) =>
                  emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  emp.dep_name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((emp) => (
                  <tr key={emp._id} className="border-b hover:bg-cyan-50 transition duration-200">
                    <td className="px-6 py-4 text-sm text-slate-700 font-poppins">{emp.sno}</td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-800 font-poppins">{emp.name}</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center justify-center relative">
                        {emp.profileImage && emp.profileImage.trim() !== "" ? (
                          <img
                            src={`${API_BASE_URL}/uploads/${emp.profileImage}`}
                            alt={emp.name}
                            className="w-10 h-10 rounded-full object-cover border-2 border-cyan-300"
                            onError={(e) => handleImageError(e, emp.profileImage)}
                          />
                        ) : null}
                        <div 
                          data-initials
                          className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-xs font-bold text-white absolute"
                          style={{ display: (!emp.profileImage || emp.profileImage.trim() === "") ? 'flex' : 'none' }}
                        >
                          {emp.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700 font-poppins">{emp.dep_name}</td>
                    <td className="px-6 py-4 text-sm text-slate-700 font-poppins">{emp.dob ? new Date(emp.dob).toLocaleDateString() : 'N/A'}</td>
                    <td className="px-6 py-4 text-sm flex gap-2 flex-wrap">
                      <Link
                        to={`/admin-dashboard/employee/${emp._id}`}
                        className="px-3 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg text-xs font-semibold hover:from-cyan-600 hover:to-blue-600 transition duration-200 shadow-md"
                        title="View Employee Details"
                      >
                        View
                      </Link>
                      <Link
                        to={`/admin-dashboard/employee/${emp._id}/edit`}
                        className="px-3 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg text-xs font-semibold hover:from-indigo-600 hover:to-purple-600 transition duration-200 shadow-md"
                        title="Edit Employee Details"
                      >
                        Edit
                      </Link>
                      <button 
                        onClick={() => navigate(`/admin-dashboard/salary/${emp.employeeId}`)}
                        className="px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg text-xs font-semibold hover:from-green-600 hover:to-emerald-600 transition duration-200 shadow-md"
                        title="View and Manage Salary"
                      >
                        💰 Salary
                      </button>
                      <button 
                        onClick={() => navigate(`/admin-dashboard/leaves`)}
                        className="px-3 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg text-xs font-semibold hover:from-orange-600 hover:to-red-600 transition duration-200 shadow-md"
                        title="View Leaves"
                      >
                        📅 Leaves
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default List