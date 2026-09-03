import React, { useState } from 'react'
import axios from 'axios'
import { API_BASE_URL } from '../../config/api'

const Settings = () => {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Clear previous messages
    setSuccessMessage('')
    setErrorMessage('')

    if (!formData.oldPassword || !formData.newPassword || !formData.confirmPassword) {
      setErrorMessage('All fields are required')
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setErrorMessage('New password and confirm password do not match')
      setErrorMessage('')
      return
    }

    if (formData.newPassword.length < 6) {
      setErrorMessage('New password must be at least 6 characters long')
      return
    }

    if (formData.oldPassword === formData.newPassword) {
      setErrorMessage('New password must be different from old password')
      return
    }

    setLoading(true)
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/change-password`,
        {
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )

      if (response.data.success) {
        setSuccessMessage('Password changed successfully!')
        setFormData({
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
        setTimeout(() => {
          setSuccessMessage('')
        }, 3000)
      }
    } catch (error) {
      console.error('Error changing password:', error)
      setErrorMessage(error.response?.data?.error || 'Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="px-4 py-6 sm:p-8 bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50 min-h-screen">
      <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg mx-auto">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-cyan-100 p-6 sm:p-8 md:p-10">
          <h3 className="text-xl sm:text-2xl font-bold font-poppins text-slate-800 mb-1">Change Password</h3>
          <p className="text-xs sm:text-sm text-slate-600 font-poppins mb-6 sm:mb-8">Update your account password</p>

          {successMessage && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-green-50 text-green-700 rounded-lg border border-green-200 font-poppins text-sm">
              ✅ {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 font-poppins text-sm">
              ❌ {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-xs sm:text-sm font-semibold font-poppins text-slate-800 mb-1.5 sm:mb-2">
                Current Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="oldPassword"
                value={formData.oldPassword}
                onChange={handleChange}
                placeholder="Enter your current password"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-slate-300 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition duration-200 bg-slate-50 font-poppins"
                required
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold font-poppins text-slate-800 mb-1.5 sm:mb-2">
                New Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Enter your new password"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-slate-300 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition duration-200 bg-slate-50 font-poppins"
                required
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold font-poppins text-slate-800 mb-1.5 sm:mb-2">
                Confirm New Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your new password"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-slate-300 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition duration-200 bg-slate-50 font-poppins"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold font-poppins py-2.5 sm:py-3 px-4 sm:px-6 text-sm sm:text-base rounded-lg transition duration-200 shadow-lg hover:shadow-xl"
            >
              {loading ? 'Changing Password...' : 'Change Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Settings
