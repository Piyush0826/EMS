import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'
import { API_BASE_URL } from '../config/api'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')

    if (!email) {
      setMessage('Please enter your email')
      setMessageType('error')
      return
    }

    setLoading(true)
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/forgot-password`,
        { email }
      )

      if (response.data.success) {
        setMessage(response.data.message)
        setMessageType('success')
        setEmail('')
        setTimeout(() => {
          navigate('/login')
        }, 3000)
      }
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to send reset email')
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center min-h-screen justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50">
      <div className="mb-8 text-center">
        <h1 className="font-playfair text-5xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-2">
          Employee Management System
        </h1>
        <p className="font-poppins text-slate-600 text-lg">Reset your password</p>
      </div>

      <div className="w-96 bg-white rounded-2xl shadow-2xl p-8 border border-cyan-100">
        <h2 className="text-3xl font-bold font-poppins text-slate-800 mb-2">Forgot Password</h2>
        <p className="text-slate-500 text-sm mb-6 font-poppins">Enter your email to receive a password reset link</p>

        {message && (
          <div className={`px-4 py-3 rounded-lg mb-4 text-sm font-medium border ${
            messageType === 'success'
              ? 'bg-green-50 border-green-200 text-green-700'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-slate-700 font-poppins font-medium mb-2">Email Address</label>
            <input
              type="email"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition duration-200 bg-slate-50 font-poppins"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition duration-200 shadow-lg hover:shadow-xl font-poppins"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-slate-600 font-poppins">
            Remember your password?{' '}
            <Link to="/login" className="text-cyan-600 hover:text-cyan-700 font-semibold">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
