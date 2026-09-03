import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { API_BASE_URL } from '../../config/api'

const AttendanceReport = () => {
  const [reportData, setReportData] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAllRecords, setShowAllRecords] = useState(false)

  useEffect(() => {
    if (!showAllRecords) {
      fetchAttendanceReport()
    }
  }, [selectedDate, showAllRecords])

  const fetchAttendanceReport = async () => {
    setLoading(true)
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/attendance/report?date=${selectedDate}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      if (response.data.success) {
        setReportData(response.data.attendance)
      }
    } catch (error) {
      console.error('Error fetching attendance report:', error)
      setReportData([])
    } finally {
      setLoading(false)
    }
  }

  const fetchAllAttendanceRecords = async () => {
    setLoading(true)
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/attendance/report`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      if (response.data.success) {
        setReportData(response.data.attendance)
        setShowAllRecords(true)
      }
    } catch (error) {
      console.error('Error fetching all attendance records:', error)
      setReportData([])
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm font-semibold font-poppins'
      case 'absent':
        return 'bg-red-100 text-red-700 px-3 py-1 rounded-lg text-sm font-semibold font-poppins'
      case 'leave':
        return 'bg-yellow-100 text-yellow-700 px-3 py-1 rounded-lg text-sm font-semibold font-poppins'
      case 'sick':
        return 'bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm font-semibold font-poppins'
      default:
        return 'bg-slate-100 text-slate-700 px-3 py-1 rounded-lg text-sm font-semibold font-poppins'
    }
  }

  const groupByDate = (records) => {
    const grouped = {}
    records.forEach(record => {
      const dateStr = new Date(record.date).toISOString().split('T')[0]
      if (!grouped[dateStr]) {
        grouped[dateStr] = []
      }
      grouped[dateStr].push(record)
    })
    return grouped
  }

  const filteredData = reportData.filter(record =>
    record.employeeId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.employeeId?.employeeId?.toString().includes(searchTerm)
  )

  const groupedData = showAllRecords ? groupByDate(filteredData) : null

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-5xl font-bold font-poppins text-slate-800 mb-2 text-center">Attendance Report</h1>
        <p className="text-slate-600 font-poppins text-center">View and track employee attendance records</p>
      </div>

      <div className="mb-6 bg-white p-6 rounded-xl shadow-md border border-cyan-100">
        <div className="flex gap-4 items-center flex-wrap">
          <div>
            <label className="block text-sm font-semibold font-poppins text-slate-800 mb-2">
              Filter by Date:
            </label>
            <input
              type="date"
              value={selectedDate}
              max={new Date().toISOString().split('T')[0]}
              onChange={(e) => {
                setSelectedDate(e.target.value)
                setShowAllRecords(false)
              }}
              disabled={showAllRecords}
              className="px-4 py-3 border border-slate-300 rounded-lg disabled:bg-slate-100 disabled:cursor-not-allowed focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition duration-200 font-poppins"
            />
          </div>
          <div className="flex items-end">
            <p className="text-sm font-medium font-poppins text-slate-700">
              Date: {showAllRecords ? 'All Records' : new Date(selectedDate).toISOString().split('T')[0]}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by Employee Name or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition duration-200 bg-white font-poppins"
        />
      </div>

      {loading ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-md">
          <div className="inline-block animate-spin">
            <div className="h-8 w-8 border-4 border-cyan-500 border-t-blue-600 rounded-full"></div>
          </div>
          <p className="text-slate-600 font-poppins mt-4">Loading attendance report...</p>
        </div>
      ) : showAllRecords ? (
        // Grouped view for all records
        <div className="space-y-6">
          {Object.keys(groupedData).length > 0 ? (
            Object.keys(groupedData)
              .sort()
              .reverse()
              .map(dateStr => (
                <div key={dateStr} className="bg-white rounded-xl shadow-lg border border-cyan-100 overflow-hidden">
                  <div className="px-6 py-4 bg-gradient-to-r from-slate-800 to-slate-900 border-b border-cyan-200">
                    <h3 className="text-lg font-bold font-poppins text-white">📅 {dateStr}</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-100 border-b-2 border-cyan-200">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-bold font-poppins text-slate-800">S No</th>
                          <th className="px-6 py-4 text-left text-sm font-bold font-poppins text-slate-800">Emp ID</th>
                          <th className="px-6 py-4 text-left text-sm font-bold font-poppins text-slate-800">Name</th>
                          <th className="px-6 py-4 text-left text-sm font-bold font-poppins text-slate-800">Department</th>
                          <th className="px-6 py-4 text-left text-sm font-bold font-poppins text-slate-800">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {groupedData[dateStr].map((record, index) => (
                          <tr key={record._id} className="border-b hover:bg-cyan-50 transition duration-200">
                            <td className="px-6 py-4 text-sm text-slate-700 font-poppins">{index + 1}</td>
                            <td className="px-6 py-4 text-sm text-slate-700 font-poppins">{record.employeeId?.employeeId || 'N/A'}</td>
                            <td className="px-6 py-4 text-sm text-slate-700 font-poppins">{record.employeeId?.name || 'N/A'}</td>
                            <td className="px-6 py-4 text-sm text-slate-700 font-poppins">{record.employeeId?.department?.dep_name || 'N/A'}</td>
                            <td className="px-6 py-4 text-sm">
                              <span className={getStatusBadge(record.status)}>
                                {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))
          ) : (
            <div className="bg-white rounded-xl shadow-md p-12 text-center border border-cyan-100">
              <p className="text-slate-500 font-poppins text-lg">No attendance records found</p>
            </div>
          )}
        </div>
      ) : (
        // Single date view
        <div className="bg-white rounded-xl shadow-lg overflow-x-auto border border-cyan-100">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-slate-800 to-slate-900 border-b-2 border-cyan-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-white font-poppins">S No</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-white font-poppins">Emp ID</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-white font-poppins">Name</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-white font-poppins">Department</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-white font-poppins">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((record, index) => (
                  <tr key={record._id} className="border-b hover:bg-cyan-50 transition duration-200">
                    <td className="px-6 py-4 text-sm text-slate-700 font-poppins">{index + 1}</td>
                    <td className="px-6 py-4 text-sm text-slate-700 font-poppins">{record.employeeId?.employeeId || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-slate-700 font-poppins">{record.employeeId?.name || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-slate-700 font-poppins">{record.employeeId?.department?.dep_name || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={getStatusBadge(record.status)}>
                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-500 font-poppins">
                    No attendance records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {filteredData.length > 0 && (
        <div className="mt-6 text-sm font-poppins text-slate-600">
          Showing <span className="font-bold text-slate-800">{filteredData.length}</span> attendance record(s)
        </div>
      )}

      {!showAllRecords && (
        <div className="mt-6">
          <button
            onClick={fetchAllAttendanceRecords}
            disabled={loading}
            className="px-8 py-3 bg-slate-400 hover:bg-slate-500 text-white font-bold font-poppins rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
          >
            Load More
          </button>
        </div>
      )}

      {showAllRecords && (
        <div className="mt-6">
          <button
            onClick={() => {
              setShowAllRecords(false)
              setReportData([])
            }}
            className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold font-poppins rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Back to Date Filter
          </button>
        </div>
      )}
    </div>
  )
}

export default AttendanceReport
