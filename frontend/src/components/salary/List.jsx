import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { API_BASE_URL } from '../../config/api'

const List = () => {
  const [salaries, setSalaries] = useState([])
  const [filteredSalaries, setFilteredSalaries] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()
  const { employeeId } = useParams()

  useEffect(() => {
    fetchSalaries()
  }, [])

  useEffect(() => {
    // Filter salaries by employee ID (exact match) or by URL parameter
    let filtered = salaries

    // If employeeId is in URL, filter to that employee
    if (employeeId) {
      filtered = filtered.filter(
        (salary) =>
          salary.employee?.employeeId?.toString() === employeeId.toString()
      )
      // Auto-fill search term to show which employee is being viewed
      if (filtered.length > 0) {
        setSearchTerm(employeeId)
      }
    } else if (searchTerm.trim() !== '') {
      // Otherwise, filter by search term if provided
      filtered = filtered.filter(
        (salary) =>
          salary.employee?.employeeId
            ?.toString()
            .toLowerCase()
            === searchTerm.toLowerCase()
      )
    }

    setFilteredSalaries(filtered)
  }, [searchTerm, salaries, employeeId])

  const fetchSalaries = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/salary`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (response.data.success) {
        setSalaries(response.data.salaries)
      }
    } catch (error) {
      console.error('Error fetching salaries:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this salary record?')) {
      try {
        const response = await axios.delete(`${API_BASE_URL}/api/salary/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        if (response.data.success) {
          alert('Salary deleted successfully')
          fetchSalaries()
        }
      } catch (error) {
        console.error('Error deleting salary:', error)
        alert('Failed to delete salary')
      }
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-96"><div className="text-slate-600 font-poppins">Loading salaries...</div></div>
  }

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50 min-h-screen">
      {employeeId && (
        <button
          onClick={() => navigate('/admin-dashboard/employees')}
          className="mb-6 text-cyan-600 hover:text-cyan-700 text-sm font-semibold font-poppins transition duration-200"
        >
          ← Back to Employees
        </button>
      )}
      <div className="mb-8">
        <h2 className="text-5xl font-bold font-poppins text-slate-800 mb-2">
          {employeeId ? `Salary Management - ${employeeId}` : 'Salary Management'}
        </h2>
        <p className="text-slate-600 font-poppins">View and manage employee salary records</p>
      </div>

      <div className="flex justify-between items-center mb-8 gap-4 flex-wrap">
        <input
          type="text"
          placeholder="Search by Employee ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 min-w-0 max-w-md px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition duration-200 bg-white font-poppins"
        />
        <button
          onClick={() => navigate('/admin-dashboard/add-salary')}
          className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold font-poppins rounded-lg transition duration-200 shadow-lg hover:shadow-xl whitespace-nowrap"
        >
          + Add Salary
        </button>
      </div>

      {filteredSalaries.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-xl shadow-md border border-cyan-100">
          <p className="text-slate-600 font-poppins text-lg">No salary records found</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-cyan-100">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-slate-800 to-slate-900 border-b-2 border-cyan-200">
                <th className="p-4 text-left text-white font-bold font-poppins text-sm">S No</th>
                <th className="p-4 text-left text-white font-bold font-poppins text-sm">Emp ID</th>
                <th className="p-4 text-left text-white font-bold font-poppins text-sm">Basic Salary</th>
                <th className="p-4 text-left text-white font-bold font-poppins text-sm">Allowance</th>
                <th className="p-4 text-left text-white font-bold font-poppins text-sm">Deduction</th>
                <th className="p-4 text-left text-white font-bold font-poppins text-sm">Net Salary</th>
                <th className="p-4 text-left text-white font-bold font-poppins text-sm">Pay Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredSalaries.map((salary, index) => (
                <tr key={salary._id} className="border-b hover:bg-cyan-50 transition duration-200">
                  <td className="p-4 text-sm text-slate-700 font-poppins">{index + 1}</td>
                  <td className="p-4 text-sm text-slate-700 font-poppins">
                    {salary.employee?.employeeId || 'N/A'}
                  </td>
                  <td className="p-4 text-sm text-slate-700 font-poppins">₹{salary.basicSalary}</td>
                  <td className="p-4 text-sm text-slate-700 font-poppins">₹{salary.allowances}</td>
                  <td className="p-4 text-sm text-slate-700 font-poppins">₹{salary.deductions}</td>
                  <td className="p-4 text-sm text-slate-800 font-bold font-poppins">₹{salary.netSalary}</td>
                  <td className="p-4 text-sm text-slate-700 font-poppins">
                    {new Date(salary.payDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default List
