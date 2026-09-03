import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { API_BASE_URL } from '../../config/api'

const Add = () => {
  const [departments, setDepartments] = useState([])
  const [employees, setEmployees] = useState([])
  const [formData, setFormData] = useState({
    department: '',
    employee: '',
    basicSalary: '',
    allowances: '',
    deductions: '',
    payDate: ''
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // Fetch departments on mount
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/department`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        if (response.data.success) {
          setDepartments(response.data.departments)
        }
      } catch (error) {
        console.error('Error fetching departments:', error)
      }
    }
    fetchDepartments()
  }, [])

  // Fetch employees on mount (all employees)
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/employee`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        if (response.data.success) {
          console.log('All employees loaded:', response.data.employees)
          setEmployees(response.data.employees)
        }
      } catch (error) {
        console.error('Error fetching employees:', error)
        alert('Failed to load employees')
      }
    }
    fetchEmployees()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    
    if (name === 'employee') {
      // When employee is selected, auto-set the department
      const selectedEmployee = employees.find(emp => emp._id === value)
      if (selectedEmployee && selectedEmployee.department) {
        setFormData({
          ...formData,
          [name]: value,
          department: selectedEmployee.department._id || selectedEmployee.department
        })
      } else {
        setFormData({ ...formData, [name]: value })
      }
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.department || !formData.employee || !formData.basicSalary || !formData.payDate) {
      alert('Please fill in all required fields')
      return
    }

    setLoading(true)
    try {
      const salaryData = {
        employee: formData.employee,
        basicSalary: Number(formData.basicSalary),
        allowances: Number(formData.allowances) || 0,
        deductions: Number(formData.deductions) || 0,
        payDate: new Date(formData.payDate).toISOString()
      }

      console.log('Sending salary data:', salaryData)

      const response = await axios.post(
        `${API_BASE_URL}/api/salary/add`,
        salaryData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )

      if (response.data.success) {
        alert('Salary added successfully')
        navigate('/admin-dashboard/salary')
      }
    } catch (error) {
      console.error('Error adding salary:', error)
      if (error.response) {
        alert(error.response.data.error || 'Failed to add salary')
      } else {
        alert('Server not reachable. Make sure the backend is running on port 5000')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto mt-8 mb-8 bg-white p-10 rounded-2xl shadow-lg border border-cyan-100">
      <div className="mb-8">
        <h2 className="text-4xl font-bold font-poppins text-slate-800 mb-2">Add New Salary</h2>
        <p className="text-slate-600 font-poppins">Add salary information for an employee</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Department */}
          <div>
            <label className="block text-sm font-semibold font-poppins text-slate-800 mb-2">Department</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition duration-200 bg-slate-50 font-poppins cursor-not-allowed opacity-75"
              disabled
            >
              <option value="">Auto-selected from Employee</option>
              {departments && departments.length > 0 ? (
                departments.map((dep) => (
                  <option key={dep._id} value={dep._id}>
                    {dep.dep_name}
                  </option>
                ))
              ) : (
                <option disabled>No departments available</option>
              )}
            </select>
          </div>

          {/* Employee */}
          <div>
            <label className="block text-sm font-semibold font-poppins text-slate-800 mb-2">Employee <span className="text-red-500">*</span></label>
            <select
              name="employee"
              value={formData.employee}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition duration-200 bg-slate-50 font-poppins"
              required
            >
              <option value="">Select Employee</option>
              {employees && employees.length > 0 ? (
                employees.map((emp) => (
                  <option key={emp._id} value={emp._id}>
                    {emp.userId?.name || emp.name || 'Unknown Employee'} ({emp.employeeId}) - {emp.department?.dep_name || 'No Department'}
                  </option>
                ))
              ) : (
                <option disabled>No employees available</option>
              )}
            </select>
          </div>

          {/* Basic Salary */}
          <div>
            <label className="block text-sm font-semibold font-poppins text-slate-800 mb-2">Basic Salary <span className="text-red-500">*</span></label>
            <input
              type="number"
              name="basicSalary"
              value={formData.basicSalary}
              onChange={handleChange}
              placeholder="Enter Basic Salary"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition duration-200 bg-slate-50 font-poppins"
              required
            />
          </div>

          {/* Allowances */}
          <div>
            <label className="block text-sm font-semibold font-poppins text-slate-800 mb-2">Allowances</label>
            <input
              type="number"
              name="allowances"
              value={formData.allowances}
              onChange={handleChange}
              placeholder="Monthly Allowances"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition duration-200 bg-slate-50 font-poppins"
            />
          </div>

          {/* Deductions */}
          <div>
            <label className="block text-sm font-semibold font-poppins text-slate-800 mb-2">Deductions</label>
            <input
              type="number"
              name="deductions"
              value={formData.deductions}
              onChange={handleChange}
              placeholder="Monthly Deductions"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition duration-200 bg-slate-50 font-poppins"
            />
          </div>

          {/* Pay Date */}
          <div>
            <label className="block text-sm font-semibold font-poppins text-slate-800 mb-2">Pay Date <span className="text-red-500">*</span></label>
            <input
              type="date"
              name="payDate"
              value={formData.payDate}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition duration-200 bg-slate-50 font-poppins"
              required
            />
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold font-poppins py-3 px-6 rounded-lg disabled:opacity-50 transition duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {loading ? 'Adding Salary...' : 'Add Salary'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin-dashboard/salary')}
            className="flex-1 bg-slate-400 hover:bg-slate-500 text-white font-bold font-poppins py-3 px-6 rounded-lg transition duration-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default Add
