import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/authContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API_BASE_URL } from '../../config/api'

const CompleteProfile = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [employee, setEmployee] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    dob: '',
    gender: '',
    maritalStatus: '',
    phone: '',
    mobile: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  })

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
            const emp = response.data.employee
            setEmployee(emp)
            
            // Check if personal info is already completed
            if (emp.personalInfoCompleted) {
              navigate('/employee-dashboard/profile')
              return
            }

            // Populate existing data if available
            setFormData({
              dob: emp.dob ? emp.dob.split('T')[0] : '',
              gender: emp.gender || '',
              maritalStatus: emp.maritalStatus || '',
              phone: emp.phone || '',
              mobile: emp.mobile || '',
              address: emp.address || '',
              city: emp.city || '',
              state: emp.state || '',
              zipCode: emp.zipCode || '',
              country: emp.country || ''
            })
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [user, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate required fields
    if (!formData.phone || !formData.mobile || !formData.address || !formData.city || !formData.state || !formData.zipCode || !formData.country) {
      alert("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)
    try {
      const token = localStorage.getItem("token")
      const response = await axios.put(
        `${API_BASE_URL}/api/employee/complete-profile/${employee._id}`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )

      if (response.data.success) {
        alert("Profile information submitted successfully!")
        navigate('/employee-dashboard/profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      if (error.response) {
        alert(error.response.data.error || "Failed to update profile")
      } else {
        alert("Failed to update profile. Please try again.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-slate-600 font-poppins">Loading...</div>
      </div>
    )
  }

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg border border-cyan-100 p-10">
        <div className="mb-8">
          <h2 className="text-4xl font-bold font-poppins text-slate-800 mb-2">Complete Your Profile</h2>
          <p className="text-slate-600 font-poppins">Please fill in your personal information. Once submitted, this information can only be edited by admin.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-semibold font-poppins text-slate-800 mb-2">
                Date of Birth
              </label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition duration-200 bg-slate-50 font-poppins"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-semibold font-poppins text-slate-800 mb-2">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition duration-200 bg-slate-50 font-poppins"
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
                Marital Status
              </label>
              <select
                name="maritalStatus"
                value={formData.maritalStatus}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition duration-200 bg-slate-50 font-poppins"
              >
                <option value="">Select Status</option>
                <option value="single">Single</option>
                <option value="married">Married</option>
                <option value="divorced">Divorced</option>
                <option value="widowed">Widowed</option>
              </select>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold font-poppins text-slate-800 mb-2">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition duration-200 bg-slate-50 font-poppins"
                required
              />
            </div>

            {/* Mobile */}
            <div>
              <label className="block text-sm font-semibold font-poppins text-slate-800 mb-2">
                Mobile <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="Enter mobile number"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition duration-200 bg-slate-50 font-poppins"
                required
              />
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold font-poppins text-slate-800 mb-2">
                Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your address"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition duration-200 bg-slate-50 font-poppins"
                required
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-semibold font-poppins text-slate-800 mb-2">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter city"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition duration-200 bg-slate-50 font-poppins"
                required
              />
            </div>

            {/* State */}
            <div>
              <label className="block text-sm font-semibold font-poppins text-slate-800 mb-2">
                State <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Enter state"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition duration-200 bg-slate-50 font-poppins"
                required
              />
            </div>

            {/* Zip Code */}
            <div>
              <label className="block text-sm font-semibold font-poppins text-slate-800 mb-2">
                Zip Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                placeholder="Enter zip code"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition duration-200 bg-slate-50 font-poppins"
                required
              />
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-semibold font-poppins text-slate-800 mb-2">
                Country <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="Enter country"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition duration-200 bg-slate-50 font-poppins"
                required
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold font-poppins hover:shadow-lg hover:scale-105 transition duration-200 disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Profile'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/employee-dashboard/profile')}
              className="px-8 py-3 border border-slate-300 text-slate-800 rounded-lg font-semibold font-poppins hover:bg-slate-50 transition duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CompleteProfile
