import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API_BASE_URL } from '../../config/api'

const AdminSettings = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [cleanupLoading, setCleanupLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [cleanupMessage, setCleanupMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (e) => { 
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleCleanupEmployees = async () => {
    const confirm = window.confirm(
      '⚠️  WARNING: This will permanently delete all employees that have no department assigned, including:\n\n• Employee records\n• User accounts\n• Associated salaries\n• Associated leaves\n\nThis action cannot be undone. Continue?'
    )
    
    if (!confirm) return

    setCleanupLoading(true)
    setCleanupMessage('')
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/api/employee/cleanup/no-department`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )

      if (response.data.success) {
        setCleanupMessage(`✅ ${response.data.message} (${response.data.deletedCount} employees deleted)`)
        setTimeout(() => setCleanupMessage(''), 3000)
      }
    } catch (error) {
      setCleanupMessage(`❌ ${error.response?.data?.error || 'Failed to cleanup employees'}`)
      setTimeout(() => setCleanupMessage(''), 3000)
    } finally {
      setCleanupLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Clear previous messages
    setSuccessMessage('')
    setErrorMessage('')

    // Validation
    if (!formData.oldPassword || !formData.newPassword || !formData.confirmPassword) {
      setErrorMessage('All fields are required')
      return
    }

    if (formData.newPassword.length < 6) {
      setErrorMessage('New password must be at least 6 characters')
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setErrorMessage('New password and confirm password do not match')
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
          navigate('/admin-dashboard')
        }, 2000)
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.error || 'Failed to change password')
      } else {
        setErrorMessage('An error occurred. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50 min-h-screen">
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-2xl shadow-lg border border-cyan-100 p-10 mb-8">
          <h3 className="text-2xl font-bold font-poppins text-slate-800 mb-1">Change Password</h3>
          <p className="text-slate-600 font-poppins text-sm mb-8">Update your account password</p>

          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200 font-poppins">
              ✅ {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 font-poppins">
              ❌ {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold font-poppins text-slate-800 mb-2">
                Current Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="oldPassword"
                value={formData.oldPassword}
                onChange={handleChange}
                placeholder="Enter your current password"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition duration-200 bg-slate-50 font-poppins disabled:opacity-70"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold font-poppins text-slate-800 mb-2">
                New Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Enter your new password"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition duration-200 bg-slate-50 font-poppins disabled:opacity-70"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold font-poppins text-slate-800 mb-2">
                Confirm New Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your new password"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition duration-200 bg-slate-50 font-poppins disabled:opacity-70"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-bold font-poppins text-white transition duration-200 shadow-lg ${
                loading
                  ? 'bg-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 hover:shadow-xl transform hover:-translate-y-0.5'
              }`}
            >
              {loading ? 'Updating...' : 'Change Password'}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-cyan-100 p-10">
          <h3 className="text-2xl font-bold font-poppins text-slate-800 mb-1">Database Cleanup</h3>
          <p className="text-slate-600 font-poppins text-sm mb-4">System Maintenance</p>

          {cleanupMessage && (
            <div className={`mb-6 p-4 rounded-lg border font-poppins ${
              cleanupMessage.includes('✅')
                ? 'bg-green-50 text-green-700 border-green-200'
                : 'bg-red-50 text-red-700 border-red-200'
            }`}>
              {cleanupMessage}
            </div>
          )}

          <p className="text-slate-600 font-poppins text-sm mb-6 leading-relaxed">
            Remove all employees that don't have a department assigned. This will also delete their associated user accounts, salaries, and leave records.
          </p>

          <button
            onClick={handleCleanupEmployees}
            disabled={cleanupLoading}
            className={`w-full py-3 rounded-lg font-bold font-poppins text-white transition duration-200 shadow-lg ${
              cleanupLoading
                ? 'bg-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 hover:shadow-xl transform hover:-translate-y-0.5'
            }`}
          >
            {cleanupLoading ? 'Cleaning up...' : 'Delete Employees Without Department'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminSettings
