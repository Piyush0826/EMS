import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { API_BASE_URL } from '../../config/api'

const Attendance = () => {
  const [employees, setEmployees] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [attendanceData, setAttendanceData] = useState({})
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [isAttendanceMarked, setIsAttendanceMarked] = useState(false)
  const [markedAttendanceIds, setMarkedAttendanceIds] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    fetchEmployees()
  }, [])

  useEffect(() => {
    checkAttendanceForDate()
  }, [selectedDate])

  const checkAttendanceForDate = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/attendance/report?date=${selectedDate}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      if (response.data.success && response.data.attendance.length > 0) {
        setIsAttendanceMarked(true)
        setMarkedAttendanceIds(response.data.attendance.map(rec => rec.employeeId._id || rec.employeeId))
        
        // Load the marked attendance data
        const data = {}
        response.data.attendance.forEach(rec => {
          const empId = rec.employeeId._id || rec.employeeId
          data[empId] = rec.status
        })
        setAttendanceData(data)
      } else {
        setIsAttendanceMarked(false)
        setMarkedAttendanceIds([])
      }
    } catch (error) {
      console.error('Error checking attendance:', error)
      setIsAttendanceMarked(false)
      setMarkedAttendanceIds([])
    }
  }

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/employee`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (response.data.success) {
        setEmployees(response.data.employees)
        // Initialize attendance data
        const data = {}
        response.data.employees.forEach(emp => {
          data[emp._id] = 'present'
        })
        setAttendanceData(data)
      }
    } catch (error) {
      console.error('Error fetching employees:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAttendanceChange = (employeeId, status) => {
    setAttendanceData(prev => ({
      ...prev,
      [employeeId]: status
    }))
  }

  const handleSubmit = async () => {
    try {
      const attendanceRecords = Object.entries(attendanceData).map(([empId, status]) => ({
        employeeId: empId,
        date: selectedDate,
        status: status
      }))

      const response = await axios.post(
        `${API_BASE_URL}/api/attendance/mark`,
        { records: attendanceRecords },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )

      if (response.data.success) {
        alert(isAttendanceMarked ? 'Attendance updated successfully' : 'Attendance marked successfully')
        checkAttendanceForDate()
      }
    } catch (error) {
      console.error('Error submitting attendance:', error)
      alert('Failed to mark attendance')
    }
  }

  const filteredEmployees = employees.filter(emp =>
    (emp?.name?.toLowerCase()?.includes(searchTerm.toLowerCase()) || false) ||
    (emp?.employeeId?.toString()?.includes(searchTerm) || false)
  )

  // Pagination logic
  const totalPages = Math.ceil(filteredEmployees.length / rowsPerPage)
  const startIndex = (currentPage - 1) * rowsPerPage
  const endIndex = startIndex + rowsPerPage
  const paginatedEmployees = filteredEmployees.slice(startIndex, endIndex)

  if (loading) {
    return <div className="text-center p-4">Loading...</div>
  }

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-5xl font-bold font-poppins text-slate-800 mb-2">Manage Attendance</h1>
        <p className="text-slate-600 font-poppins text-lg">Mark employee attendance for the selected date</p>
      </div>

      <div className="flex justify-between items-center mb-8 gap-4 flex-wrap">
        <div className="flex-1 min-w-0">
          <input
            type="text"
            placeholder="Search by Employee ID or Name..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
            className="w-full max-w-md px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition duration-200 bg-white font-poppins"
          />
        </div>
        <button
          onClick={() => navigate('/admin-dashboard/attendance-report')}
          className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold font-poppins py-3 px-6 rounded-lg transition duration-200 shadow-lg hover:shadow-xl"
        >
          Attendance Report
        </button>
      </div>

      {/* Date Section */}
      <div className="mb-6 bg-white p-6 rounded-xl shadow-md border border-cyan-100">
        <h2 className="text-2xl font-bold font-poppins text-slate-800 mb-4">
          Mark Attendance
        </h2>
        <div className="flex gap-4 items-end flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-semibold font-poppins text-slate-800 mb-2">Date</label>
            <input
              type="date"
              value={selectedDate}
              max={new Date().toISOString().split('T')[0]}
              onChange={(e) => {
                setSelectedDate(e.target.value)
                setCurrentPage(1)
              }}
              className="px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition duration-200 bg-slate-50 font-poppins"
            />
          </div>
          {isAttendanceMarked && selectedDate === new Date().toISOString().split('T')[0] && (
            <div className="flex-1 min-w-[300px]">
              <div className="px-4 py-3 bg-blue-50 border border-blue-300 rounded-lg">
                <p className="text-blue-900 font-poppins text-sm">
                  <span className="font-semibold">✓ Attendance marked for today</span>
                </p>
              </div>
            </div>
          )}
          {isAttendanceMarked && selectedDate !== new Date().toISOString().split('T')[0] && (
            <div className="flex-1 min-w-[300px]">
              <div className="px-4 py-3 bg-green-50 border border-green-300 rounded-lg">
                <p className="text-green-900 font-poppins text-sm">
                  <span className="font-semibold">✓ Attendance already marked for this date</span>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-x-auto border border-cyan-100">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-slate-800 to-slate-900 border-b-2 border-cyan-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-bold text-white">S No</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-white">Name</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-white">Emp ID</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-white">Department</th>
              <th className="px-6 py-4 text-center text-sm font-bold text-white">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedEmployees.length > 0 ? (
              paginatedEmployees.map((emp, index) => (
                <tr key={emp._id} className="border-b hover:bg-cyan-50 transition duration-200">
                  <td className="px-6 py-4 text-sm text-slate-700 font-poppins">{startIndex + index + 1}</td>
                  <td className="px-6 py-4 text-sm text-slate-700 font-poppins">{emp.userId?.name || emp.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-700 font-poppins">{emp.employeeId}</td>
                  <td className="px-6 py-4 text-sm text-slate-700 font-poppins">{emp.department?.dep_name || 'N/A'}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleAttendanceChange(emp._id, 'present')}
                        className={`px-3 py-2 rounded-lg font-semibold text-xs transition-all font-poppins ${
                          attendanceData[emp._id] === 'present'
                            ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg'
                            : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                        }`}
                      >
                        Present
                      </button>
                      <button
                        onClick={() => handleAttendanceChange(emp._id, 'absent')}
                        className={`px-3 py-2 rounded-lg font-semibold text-xs transition-all font-poppins ${
                          attendanceData[emp._id] === 'absent'
                            ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg'
                            : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                        }`}
                      >
                        Absent
                      </button>
                      <button
                        onClick={() => handleAttendanceChange(emp._id, 'sick')}
                        className={`px-3 py-2 rounded-lg font-semibold text-xs transition-all font-poppins ${
                          attendanceData[emp._id] === 'sick'
                            ? 'bg-slate-600 hover:bg-slate-700 text-white shadow-lg'
                            : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                        }`}
                      >
                        Sick
                      </button>
                      <button
                        onClick={() => handleAttendanceChange(emp._id, 'leave')}
                        className={`px-3 py-2 rounded-lg font-semibold text-xs transition-all font-poppins ${
                          attendanceData[emp._id] === 'leave'
                            ? 'bg-yellow-500 hover:bg-yellow-600 text-white shadow-lg'
                            : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                        }`}
                      >
                        Leave
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-slate-500 font-poppins">
                  No employees found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-8 bg-white p-6 rounded-xl shadow-md border border-cyan-100 flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm text-slate-700 font-medium font-poppins">Rows per page:</label>
          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value))
              setCurrentPage(1)
            }}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition duration-200 bg-slate-50 font-poppins"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
          </select>
        </div>

        <div className="text-sm text-slate-700 font-medium font-poppins">
          {filteredEmployees.length > 0 ? `${startIndex + 1}-${Math.min(endIndex, filteredEmployees.length)} of ${filteredEmployees.length}` : '0 of 0'}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="px-3 py-2 border border-slate-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-cyan-100 text-sm font-medium text-slate-700 transition duration-200 font-poppins"
          >
            {'<<'}
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 border border-slate-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-cyan-100 text-sm font-medium text-slate-700 transition duration-200 font-poppins"
          >
            {'<'}
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 border border-slate-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-cyan-100 text-sm font-medium text-slate-700 transition duration-200 font-poppins"
          >
            {'>'}
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 border border-slate-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-cyan-100 text-sm font-medium text-slate-700 transition duration-200 font-poppins"
          >
            {'>>'}
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-8 flex justify-end gap-4">
        {!isAttendanceMarked ? (
          <button
            onClick={handleSubmit}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold font-poppins py-3 px-8 rounded-lg transition duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Submit Attendance
          </button>
        ) : selectedDate === new Date().toISOString().split('T')[0] ? (
          <button
            onClick={handleSubmit}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold font-poppins py-3 px-8 rounded-lg transition duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Update Attendance
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold font-poppins py-3 px-8 rounded-lg transition duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Submit Attendance
          </button>
        )}
      </div>
    </div>
  )
}

export default Attendance
