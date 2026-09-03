import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/authContext'
import SummaryCard from '../dashboard/SummaryCard'
import { FaUser, FaBuilding, FaCalendarAlt } from 'react-icons/fa'
import axios from 'axios'
import { API_BASE_URL } from '../../config/api'

const Summary = () => {
  const { user } = useAuth()
  const [profileData, setProfileData] = useState(null)
  const [leaveData, setLeaveData] = useState({
    total: 0,
    taken: 0,
    remaining: 0,
    pending: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token")
        if (user && user._id) {
          // Fetch profile
          const profileResponse = await axios.get(`${API_BASE_URL}/api/employee/profile/${user._id}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
          if (profileResponse.data.success) {
            setProfileData(profileResponse.data.employee)
          }

          // Fetch leaves
          const leaveResponse = await axios.get(`${API_BASE_URL}/api/leave/user/${user._id}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
          
          if (leaveResponse.data.success && leaveResponse.data.leaves) {
            const leaves = leaveResponse.data.leaves
            
            // Calculate leave statistics
            const currentYear = new Date().getFullYear()
            const thisYearLeaves = leaves.filter(leave => {
              const leaveYear = new Date(leave.startDate).getFullYear()
              return leaveYear === currentYear
            })

            const taken = thisYearLeaves.filter(leave => leave.status === 'Approved').length
            const pending = thisYearLeaves.filter(leave => leave.status === 'Pending').length
            const total = 20 // Default annual leaves (can be customized per employee)
            const remaining = total - taken

            setLeaveData({
              total,
              taken,
              remaining: Math.max(0, remaining),
              pending
            })
          }
        }
      } catch (error) {
        console.log("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  return (
    <div className='p-6'>
      {/* Welcome Section */}
      <div className='mb-8 flex items-center space-x-4'>
        <div className='bg-teal-600 text-white w-20 h-20 rounded flex items-center justify-center'>
          <FaUser size={40} />
        </div>
        <div>
          <h2 className='text-3xl font-bold'>Welcome Back</h2>
          <p className='text-xl font-semibold text-gray-800'>{user?.name || 'Employee'}</p>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        <SummaryCard icon={<FaUser />} text={"My Profile"} number={user?.name} color={"bg-teal-600"} />
        <SummaryCard icon={<FaBuilding />} text={"Department"} number={profileData?.department?.dep_name || user?.department} color={"bg-blue-600"} />
        
        {/* Enhanced Leave Card */}
        <div className="rounded-xl flex bg-white shadow-lg hover:shadow-2xl border border-cyan-100 overflow-hidden transition-all duration-300 transform hover:-translate-y-1">
          <div className="text-4xl flex justify-center items-center bg-red-600 text-white px-6 bg-gradient-to-br">
            <FaCalendarAlt />
          </div>
          <div className="pl-6 py-4 flex-1">
            <p className="text-sm font-poppins font-semibold text-slate-600 uppercase tracking-wide">Leaves Status</p>
            <div className="mt-2 space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-xs font-poppins text-slate-600">Total: <span className="font-bold text-slate-800">{leaveData.total}</span></span>
                <span className="text-xs font-poppins text-slate-600">Taken: <span className="font-bold text-red-600">{leaveData.taken}</span></span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-poppins text-slate-600">Remaining: <span className="font-bold text-green-600">{leaveData.remaining}</span></span>
                {leaveData.pending > 0 && (
                  <span className="text-xs font-poppins text-slate-600">Pending: <span className="font-bold text-orange-600">{leaveData.pending}</span></span>
                )}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-red-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(leaveData.taken / leaveData.total) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Summary
