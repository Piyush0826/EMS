import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import { useAuth } from '../context/authContext.jsx';
import { API_BASE_URL } from '../config/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  
  const recaptchaRef = useRef();
  const { login } = useAuth();
  const navigate = useNavigate();

  // Handle CAPTCHA verification
  const handleCaptchaChange = (token) => {
    if (token) {
      setCaptchaVerified(true);
    } else {
      setCaptchaVerified(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Check if CAPTCHA is verified
    if (!captchaVerified) {
      setError('Please verify the CAPTCHA');
      return;
    }

    setLoading(true);

    try {
      // Get CAPTCHA token
      const captchaToken = recaptchaRef.current.getValue();

      const response = await axios.post(
        `${API_BASE_URL}/api/auth/login`,
        { 
          email, 
          password,
          captchaToken // Send CAPTCHA token to backend for verification
        }
      );

      if (response.data.success) {
        login(response.data.user);
        localStorage.setItem("token", response.data.token);

        if (response.data.user.role === "admin") {
          navigate('/admin-dashboard');
        } else {
          navigate('/employee-dashboard'); 
        }
      }
    } catch (error) {
      const message = error.response?.data?.message || error.response?.data?.error;
      setError(message || "Server Error: Please try again later.");
      // Reset CAPTCHA on error
      recaptchaRef.current.reset();
      setCaptchaVerified(false);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!forgotEmail) {
      setError('Please enter your email address');
      return;
    }

    setForgotLoading(true);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/forgot-password`,
        { email: forgotEmail }
      );

      if (response.data.success) {
        setSuccess('Password reset link has been sent to your email. Please check your inbox.');
        setForgotEmail('');
        setTimeout(() => {
          setShowForgotPassword(false);
          setSuccess(null);
        }, 3000);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.error || error.response.data.message);
      } else {
        setError("Failed to send reset email. Please try again.");
      }
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white">
      {/* Left Side - Logo Section */}
      <div className="hidden lg:flex w-full lg:w-1/2 bg-gradient-to-br from-blue-500 to-blue-700 items-center justify-center p-8">
        <div className="text-center">
          {/* Logo - with fallback colored circle */}
          <div className="w-64 h-64 bg-white rounded-full flex items-center justify-center shadow-2xl mb-8">
            <div className="w-56 h-56 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
              EMS
            </div>
          </div>
          <h1 className="text-white text-3xl font-bold font-poppins mb-2">
            Employee Management
          </h1>
          <p className="text-blue-100 text-lg font-poppins">
            Manage your workforce efficiently
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-gray-50 lg:bg-white">
        <div className="w-full max-w-md">
          {/* Mobile Logo - visible only on small screens */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg mx-auto mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                EMS
              </div>
            </div>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100">
            {!showForgotPassword ? (
              <>
                <h2 className="text-2xl sm:text-3xl font-bold font-poppins text-slate-800 mb-1">Login</h2>
                <p className="text-xs sm:text-sm text-slate-500 mb-6 font-poppins">Enter your credentials to access the system</p>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm font-poppins">
                    {error}
                  </div>
                )}

                {/* Success Message */}
                {success && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 text-sm font-poppins">
                    ✅ {success}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                  {/* Username/Email Field */}
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold font-poppins text-slate-800 mb-2">
                      Enter Username <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="email" 
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200 bg-slate-50 font-poppins"
                      placeholder='Enter your email'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      required
                    />
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold font-poppins text-slate-800 mb-2">
                      Enter Password <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="password" 
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200 bg-slate-50 font-poppins"
                      placeholder='••••••••'
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      required
                    />
                  </div>

                  {/* Remember Me */}
                  <div className="flex items-center justify-between">
                    <label className="inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        id="rememberMe"
                        className="w-4 h-4 bg-white border border-slate-300 rounded accent-blue-500 cursor-pointer"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                      <span className="ml-2 text-xs sm:text-sm text-slate-700 font-poppins cursor-pointer">
                        Remember Me
                      </span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setShowForgotPassword(true);
                        setError(null);
                        setSuccess(null);
                      }}
                      className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-semibold transition duration-200 font-poppins"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  {/* CAPTCHA Verification */}
                  <div className="flex justify-center py-2">
                    <ReCAPTCHA
                      ref={recaptchaRef}
                      sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                      onChange={handleCaptchaChange}
                      theme="light"
                      size="normal"
                    />
                  </div>

                  {/* CAPTCHA Error Message */}
                  {!captchaVerified && error?.includes('CAPTCHA') && (
                    <div className="text-center text-red-500 text-xs sm:text-sm font-poppins">
                      ⚠️ Please verify the CAPTCHA
                    </div>
                  )}

                  {/* Login Button */}
                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2.5 sm:py-3 rounded-lg font-bold font-poppins hover:from-blue-600 hover:to-blue-700 transition duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base mt-6"
                  >
                    {loading ? 'Logging in...' : 'Login'}
                  </button>
                </form>
              </>
            ) : (
              <>
                <h2 className="text-2xl sm:text-3xl font-bold font-poppins text-slate-800 mb-1">Reset Password</h2>
                <p className="text-xs sm:text-sm text-slate-500 mb-6 font-poppins">Enter your email to receive a password reset link</p>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm font-poppins">
                    {error}
                  </div>
                )}

                {/* Success Message */}
                {success && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 text-sm font-poppins">
                    ✅ {success}
                  </div>
                )}

                <form onSubmit={handleForgotPassword} className="space-y-4 sm:space-y-5">
                  {/* Email Field */}
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold font-poppins text-slate-800 mb-2">
                      Enter Email Address <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="email" 
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200 bg-slate-50 font-poppins"
                      placeholder='Enter your email'
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      required
                    />
                  </div>

                  {/* Forgot Password Button */}
                  <button 
                    type="submit"
                    disabled={forgotLoading}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2.5 sm:py-3 rounded-lg font-bold font-poppins hover:from-blue-600 hover:to-blue-700 transition duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base mt-6"
                  >
                    {forgotLoading ? 'Sending Link...' : 'Send Reset Link'}
                  </button>

                  {/* Back to Login */}
                  <button 
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(false);
                      setError(null);
                      setSuccess(null);
                      setForgotEmail('');
                    }}
                    className="w-full bg-gray-200 text-gray-800 py-2.5 sm:py-3 rounded-lg font-bold font-poppins hover:bg-gray-300 transition duration-200 text-sm sm:text-base mt-3"
                  >
                    Back to Login
                  </button>
                </form>
              </>
            )}
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-slate-500 mt-6 font-poppins">
            © 2024 Employee Management System. All Rights Reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;