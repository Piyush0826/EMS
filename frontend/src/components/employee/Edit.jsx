import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API_BASE_URL } from '../../config/api'
import { handleImageError } from '../../utils/EmployeeHelper'

const Edit = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [employee, setEmployee] = useState(null)
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(true)
  const [departments, setDepartments] = useState([])
  const [imagePreview, setImagePreview] = useState(null)
  const [newImage, setNewImage] = useState(null)

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/employee/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        )
        if (response.data.success) {
          setEmployee(response.data.employee)
          setImagePreview(response.data.employee.userId?.profileImage || null)
          setFormData({
            name: response.data.employee.userId?.name || '',
            email: response.data.employee.userId?.email || '',
            employeeId: response.data.employee.employeeId,
            dob: response.data.employee.dob ? response.data.employee.dob.split('T')[0] : '',
            gender: response.data.employee.gender || '',
            maritalStatus: response.data.employee.maritalStatus || '',
            designation: response.data.employee.designation,
            department: response.data.employee.department?._id || '',
            salary: response.data.employee.salary,
            phone: response.data.employee.phone || '',
            mobile: response.data.employee.mobile || '',
            address: response.data.employee.address || '',
            city: response.data.employee.city || '',
            state: response.data.employee.state || '',
            zipCode: response.data.employee.zipCode || '',
            country: response.data.employee.country || ''
          })
        }
      } catch (error) {
        console.error('Error fetching employee:', error)
        alert('Failed to load employee details')
      }
    }

    const fetchDepartments = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/department`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        if (response.data.success) {
          setDepartments(response.data.departments)
        }
      } catch (error) {
        console.error('Error fetching departments:', error)
      }
    }

    fetchEmployee()
    fetchDepartments()
    setLoading(false)
  }, [id])

  const handleChange = (e) => {
    const { name, value, files } = e.target
    if (name === 'image') {
      if (files && files[0]) {
        setNewImage(files[0])
        const reader = new FileReader()
        reader.onloadend = () => {
          setImagePreview(reader.result)
        }
        reader.readAsDataURL(files[0])
      }
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name || !formData.designation || !formData.department) {
      alert('Please fill in all required fields')
      return
    }

    try {
      let submitData

      if (newImage) {
        // Use FormData for file upload
        submitData = new FormData()
        submitData.append('name', formData.name)
        submitData.append('maritalStatus', formData.maritalStatus)
        submitData.append('designation', formData.designation)
        submitData.append('department', formData.department)
        submitData.append('salary', formData.salary)
        submitData.append('phone', formData.phone)
        submitData.append('mobile', formData.mobile)
        submitData.append('address', formData.address)
        submitData.append('city', formData.city)
        submitData.append('state', formData.state)
        submitData.append('zipCode', formData.zipCode)
        submitData.append('country', formData.country)
        submitData.append('image', newImage)
      } else {
        // Use JSON if no image
        submitData = formData
      }

      const response = await axios.put(
        `${API_BASE_URL}/api/employee/${id}`,
        submitData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            ...(newImage ? {} : { 'Content-Type': 'application/json' })
          }
        }
      )

      if (response.data.success) {
        alert('Employee updated successfully')
        navigate('/admin-dashboard/employees')
      }
    } catch (error) {
      console.error('Error updating employee:', error)
      if (error.response) {
        alert(error.response.data.error || 'Failed to update employee')
      } else {
        alert('Server not reachable. Make sure the backend is running on port 5000')
      }
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-slate-600 font-poppins">Loading employee details...</div>
      </div>
    )
  }

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white p-10 rounded-2xl shadow-lg border border-cyan-100">
      <h2 className="text-4xl font-bold font-poppins text-slate-800 mb-2">Edit Employee</h2>
      <p className="text-slate-600 font-poppins mb-8">Update employee information</p>

      <form onSubmit={handleSubmit}>
        {/* Profile Image Section */}
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            {imagePreview ? (
              <div className="relative">
                {imagePreview.startsWith('data:') ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-32 h-32 rounded-full object-cover"
                  />
                ) : (
                  <img
                    src={`${API_BASE_URL}/uploads/${imagePreview}`}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover"
                    onError={(e) => handleImageError(e, imagePreview)}
                  />
                )}
              </div>
            ) : (
              <div className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center text-gray-600">
                No Image
              </div>
            )}
          </div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Upload New Photo</label>
          <input
            type="file"
            name="image"
            onChange={handleChange}
            accept="image/*"
            className="block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold font-poppins text-slate-800 mb-2">Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition duration-200 bg-slate-50 font-poppins"
              required
            />
          </div>

          {/* Marital Status */}
          <div>
            <label className="block text-sm font-semibold font-poppins text-slate-800 mb-2">Marital Status</label>
            <select
              name="maritalStatus"
              value={formData.maritalStatus}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition duration-200 bg-slate-50 font-poppins"
            >
              <option value="">Select Status</option>
              <option value="single">Single</option>
              <option value="married">Married</option>
            </select>
          </div>

          {/* Designation */}
          <div>
            <label className="block text-sm font-semibold font-poppins text-slate-800 mb-2">Designation <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition duration-200 bg-slate-50 font-poppins"
              required
            />
          </div>

          {/* Salary */}
          <div>
            <label className="block text-sm font-semibold font-poppins text-slate-800 mb-2">Salary <span className="text-red-500">*</span></label>
            <input
              type="number"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition duration-200 bg-slate-50 font-poppins"
              required
            />
          </div>

          {/* Department */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold font-poppins text-slate-800 mb-2">Department <span className="text-red-500">*</span></label>
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

          {/* Contact Information Section */}
          <div className="md:col-span-2 mt-6 pt-6 border-l-4 border-cyan-500 pl-6">
            <h3 className="text-lg font-bold font-poppins text-slate-800 mb-6">Contact Information</h3>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold font-poppins text-slate-800 mb-2">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition duration-200 bg-slate-50 font-poppins"
            />
          </div>

          {/* Mobile */}
          <div>
            <label className="block text-sm font-semibold font-poppins text-slate-800 mb-2">Mobile</label>
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Enter mobile number"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition duration-200 bg-slate-50 font-poppins"
            />
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold font-poppins text-slate-800 mb-2">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter address"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition duration-200 bg-slate-50 font-poppins"
            />
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-semibold font-poppins text-slate-800 mb-2">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Enter city"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition duration-200 bg-slate-50 font-poppins"
            />
          </div>

          {/* State */}
          <div>
            <label className="block text-sm font-semibold font-poppins text-slate-800 mb-2">State</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="Enter state"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition duration-200 bg-slate-50 font-poppins"
            />
          </div>

          {/* Zip Code */}
          <div>
            <label className="block text-sm font-semibold font-poppins text-slate-800 mb-2">Zip Code</label>
            <input
              type="text"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              placeholder="Enter zip code"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition duration-200 bg-slate-50 font-poppins"
            />
          </div>

          {/* Country */}
          <div>
            <label className="block text-sm font-semibold font-poppins text-slate-800 mb-2">Country</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="Enter country"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition duration-200 bg-slate-50 font-poppins"
            />
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          <button
            type="submit"
            className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold font-poppins py-3 px-6 rounded-lg transition duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Update Employee
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin-dashboard/employees')}
            className="flex-1 bg-slate-400 hover:bg-slate-500 text-white font-bold font-poppins py-3 px-6 rounded-lg transition duration-200"
          >
            Cancel
          </button>
        </div>
      </form>
      </div>
    </div>
  )
}

export default Edit
