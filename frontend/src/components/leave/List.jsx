import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { API_BASE_URL } from '../../config/api'

const LeaveList = () => {
  const [leaves, setLeaves] = useState([])
  const [filteredLeaves, setFilteredLeaves] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetchLeaves()
  }, [])

  useEffect(() => {
    let filtered = leaves

    // Filter by status if selected
    if (statusFilter) {
      filtered = filtered.filter(leave => leave.status === statusFilter)
    }

    // Filter by search term (employee name or ID)
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(leave =>
        leave.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        leave.employeeId?.employeeId?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredLeaves(filtered)
  }, [searchTerm, statusFilter, leaves])

  const fetchLeaves = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/leave`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (response.data.success) {
        setLeaves(response.data.leaves)
      }
    } catch (error) {
      console.error('Error fetching leaves:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-700 font-poppins font-semibold'
      case 'Rejected':
        return 'bg-red-100 text-red-700 font-poppins font-semibold'
      case 'Pending':
      default:
        return 'bg-yellow-100 text-yellow-700 font-poppins font-semibold'
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <p className="text-gray-600">Loading leaves...</p>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50 min-h-screen px-8 py-8">
      <div className="mb-8">
        <h2 className="text-5xl font-bold font-poppins text-slate-800 mb-2">Manage Leaves</h2>
        <p className="text-slate-600 font-poppins">Review and approve employee leave requests</p>
      </div>

      <div className="flex justify-between items-center mb-8 gap-4 flex-wrap">
        <div className="flex gap-3">
          <button
            onClick={() => setStatusFilter('Pending')}
            className={`px-6 py-3 rounded-lg font-semibold font-poppins transition-all ${
              statusFilter === 'Pending' 
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg' 
                : 'bg-white text-slate-700 border border-slate-300 hover:border-cyan-500'
            }`}
          >
            ⏳ Pending
          </button>
          <button
            onClick={() => setStatusFilter('Approved')}
            className={`px-6 py-3 rounded-lg font-semibold font-poppins transition-all ${
              statusFilter === 'Approved' 
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg' 
                : 'bg-white text-slate-700 border border-slate-300 hover:border-green-500'
            }`}
          >
            ✅ Approved
          </button>
          <button
            onClick={() => setStatusFilter('Rejected')}
            className={`px-6 py-3 rounded-lg font-semibold font-poppins transition-all ${
              statusFilter === 'Rejected' 
                ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg' 
                : 'bg-white text-slate-700 border border-slate-300 hover:border-red-500'
            }`}
          >
            ❌ Rejected
          </button>
          <button
            onClick={() => setStatusFilter('')}
            className={`px-6 py-3 rounded-lg font-semibold font-poppins transition-all ${
              statusFilter === '' 
                ? 'bg-slate-600 text-white shadow-lg' 
                : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
            }`}
          >
            Show All
          </button>
        </div>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by Employee ID or Name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition duration-200 bg-white font-poppins w-full"
        />
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-x-auto border border-cyan-100">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-slate-800 to-slate-900 border-b-2 border-cyan-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-bold text-white font-poppins">S No</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-white font-poppins">Emp ID</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-white font-poppins">Name</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-white font-poppins">Leave Type</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-white font-poppins">Department</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-white font-poppins">Days</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-white font-poppins">Status</th>
              <th className="px-6 py-4 text-center text-sm font-bold text-white font-poppins">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeaves.length > 0 ? (
              filteredLeaves.map((leave, index) => {
                const startDate = new Date(leave.startDate)
                const endDate = new Date(leave.endDate)
                const daysCount = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1
                
                return (
                  <tr key={leave._id} className="border-b hover:bg-cyan-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-700 font-poppins">{index + 1}</td>
                    <td className="px-6 py-4 text-sm text-slate-700 font-poppins">{leave.employeeId?.employeeId || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-slate-700 font-poppins">{leave.userId?.name || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-slate-700 font-poppins">{leave.leaveType}</td>
                    <td className="px-6 py-4 text-sm text-slate-700 font-poppins">{leave.employeeId?.department?.dep_name || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-slate-700 font-poppins font-semibold">{daysCount}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${getStatusBadge(leave.status)}`}>
                        {leave.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-center">
                      <button
                        onClick={() => navigate(`/admin-dashboard/leave/${leave._id}`)}
                        className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-cyan-600 hover:to-blue-700 text-xs font-semibold transition duration-200 shadow-md"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan="8" className="px-6 py-8 text-center text-slate-600 font-poppins">
                  No leaves found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {filteredLeaves.length > 0 && (
        <div className="mt-6 text-sm font-poppins text-slate-600">
          Showing <span className="font-bold text-slate-800">{filteredLeaves.length}</span> of <span className="font-bold text-slate-800">{leaves.length}</span> leaves
        </div>
      )}
    </div>
  )
}

export default LeaveList
