import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/authContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API_BASE_URL } from '../../config/api'
import { handleImageError } from '../../utils/EmployeeHelper'

const Profile = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [employee, setEmployee] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token")
        if (user && user._id) {
          const response = await axios.get(
            `${API_BASE_URL}/api/employee/profile/${user._id}`,
            {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }
          )
          if (response.data.success) {
            setEmployee(response.data.employee)
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [user])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-slate-600 font-poppins">Loading profile details...</div>
      </div>
    )
  }

  if (!employee) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-slate-600 font-poppins">Profile not found</div>
      </div>
    )
  }

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg border border-cyan-100 p-10">
        <div className="mb-10">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-4xl font-bold font-poppins text-slate-800 mb-1">Employee Profile</h2>
              <p className="text-slate-600 font-poppins">Your personal employee information</p>
            </div>
            {user?.role === 'admin' && (
              <button
                onClick={() => navigate(`/admin-dashboard/edit-profile/${employee._id}`)}
                className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold font-poppins hover:shadow-lg hover:scale-105 transition duration-200"
              >
                Edit Profile
              </button>
            )}
            {user?.role === 'employee' && !employee.personalInfoCompleted && (
              <button
                onClick={() => navigate('/employee-dashboard/complete-profile')}
                className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold font-poppins hover:shadow-lg hover:scale-105 transition duration-200"
              >
                Complete Profile
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left Column - Profile Image */}
          <div className="flex flex-col items-center">
            <div className="mb-6">
              {employee.userId?.profileImage ? (
                <img
                  src={`${API_BASE_URL}/uploads/${employee.userId.profileImage}`}
                  alt={employee.userId?.name}
                  className="w-56 h-56 rounded-2xl object-cover shadow-lg border-4 border-cyan-200"
                  onError={(e) => handleImageError(e, employee.userId.profileImage)}
                />
              ) : (
                <div className="w-56 h-56 bg-gradient-to-br from-cyan-400 to-blue-500 text-white rounded-2xl flex items-center justify-center text-5xl font-bold shadow-lg border-4 border-cyan-200">
                  {employee.userId?.name?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <h3 className="text-2xl font-bold font-poppins text-slate-800">{employee.userId?.name}</h3>
            <p className="text-slate-600 font-poppins mt-1">{employee.designation}</p>
          </div>

          {/* Right Column - Detailed Information */}
          <div className="space-y-5">
            <div className="border-l-4 border-cyan-500 pl-4">
              <label className="block text-xs font-semibold font-poppins text-slate-500 uppercase tracking-wide">Email</label>
              <p className="mt-1 text-lg text-slate-800 font-poppins font-medium">{employee.userId?.email}</p>
            </div>

            <div className="border-l-4 border-cyan-500 pl-4">
              <label className="block text-xs font-semibold font-poppins text-slate-500 uppercase tracking-wide">Employee ID</label>
              <p className="mt-1 text-lg text-slate-800 font-poppins font-medium">{employee.employeeId}</p>
            </div>

            <div className="border-l-4 border-cyan-500 pl-4">
              <label className="block text-xs font-semibold font-poppins text-slate-500 uppercase tracking-wide">Date of Birth</label>
              <p className="mt-1 text-lg text-slate-800 font-poppins font-medium">
                {employee.dob ? new Date(employee.dob).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
              </p>
            </div>

            <div className="border-l-4 border-cyan-500 pl-4">
              <label className="block text-xs font-semibold font-poppins text-slate-500 uppercase tracking-wide">Gender</label>
              <p className="mt-1 text-lg text-slate-800 font-poppins font-medium capitalize">{employee.gender || 'N/A'}</p>
            </div>

            <div className="border-l-4 border-blue-500 pl-4">
              <label className="block text-xs font-semibold font-poppins text-slate-500 uppercase tracking-wide">Marital Status</label>
              <p className="mt-1 text-lg text-slate-800 font-poppins font-medium capitalize">{employee.maritalStatus || 'N/A'}</p>
            </div>

            <div className="border-l-4 border-blue-500 pl-4">
              <label className="block text-xs font-semibold font-poppins text-slate-500 uppercase tracking-wide">Department</label>
              <p className="mt-1 text-lg text-slate-800 font-poppins font-medium">{employee.department?.dep_name || 'N/A'}</p>
            </div>

            <div className="border-l-4 border-blue-500 pl-4">
              <label className="block text-xs font-semibold font-poppins text-slate-500 uppercase tracking-wide">Salary</label>
              <p className="mt-1 text-lg text-slate-800 font-poppins font-medium">₹{employee.salary?.toLocaleString() || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="mt-12 pt-8 border-t-2 border-cyan-200">
          <h3 className="text-2xl font-bold font-poppins text-slate-800 mb-8">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border-l-4 border-cyan-500 pl-4">
              <label className="block text-xs font-semibold font-poppins text-slate-500 uppercase tracking-wide">Phone</label>
              <p className="mt-1 text-lg text-slate-800 font-poppins font-medium">{employee.phone || 'N/A'}</p>
            </div>

            <div className="border-l-4 border-cyan-500 pl-4">
              <label className="block text-xs font-semibold font-poppins text-slate-500 uppercase tracking-wide">Mobile</label>
              <p className="mt-1 text-lg text-slate-800 font-poppins font-medium">{employee.mobile || 'N/A'}</p>
            </div>

            <div className="md:col-span-2 border-l-4 border-cyan-500 pl-4">
              <label className="block text-xs font-semibold font-poppins text-slate-500 uppercase tracking-wide">Address</label>
              <p className="mt-1 text-lg text-slate-800 font-poppins font-medium">{employee.address || 'N/A'}</p>
            </div>

            <div className="border-l-4 border-blue-500 pl-4">
              <label className="block text-xs font-semibold font-poppins text-slate-500 uppercase tracking-wide">City</label>
              <p className="mt-1 text-lg text-slate-800 font-poppins font-medium">{employee.city || 'N/A'}</p>
            </div>

            <div className="border-l-4 border-blue-500 pl-4">
              <label className="block text-xs font-semibold font-poppins text-slate-500 uppercase tracking-wide">State</label>
              <p className="mt-1 text-lg text-slate-800 font-poppins font-medium">{employee.state || 'N/A'}</p>
            </div>

            <div className="border-l-4 border-blue-500 pl-4">
              <label className="block text-xs font-semibold font-poppins text-slate-500 uppercase tracking-wide">Zip Code</label>
              <p className="mt-1 text-lg text-slate-800 font-poppins font-medium">{employee.zipCode || 'N/A'}</p>
            </div>

            <div className="border-l-4 border-blue-500 pl-4">
              <label className="block text-xs font-semibold font-poppins text-slate-500 uppercase tracking-wide">Country</label>
              <p className="mt-1 text-lg text-slate-800 font-poppins font-medium">{employee.country || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Information Note */}
        {user?.role === 'employee' && employee.personalInfoCompleted && (
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-slate-700 font-poppins text-sm">
              <span className="font-semibold">Note:</span> Your personal information has been submitted. To make any changes, please contact your administrator.
            </p>
          </div>
        )}

        {user?.role === 'employee' && !employee.personalInfoCompleted && (
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-slate-700 font-poppins text-sm">
              <span className="font-semibold">Action Required:</span> Please complete your personal information by clicking the "Complete Profile" button above.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile
