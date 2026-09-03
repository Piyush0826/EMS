import React, { useState, useEffect } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import DataTable from  "react-data-table-component"
import { DepartmentButtonsColumn, DepartmentButtons } from "../../utils/DepartmentHelper"
import { API_BASE_URL } from "../../config/api"


const DepartmentList = () => {
  const [departments, setDepartments] = useState([])
  const [departmentLoading, setDepartmentLoading] = useState(false)
  const [filteredDepartments, setFilterDepartments] = useState([])

  const onDepartmentDelete = (id)=>{
    const data = departments.filter((dep) => dep._id !== id);
    setDepartments(data);
    setFilterDepartments(data);
  }

  const columns = DepartmentButtonsColumn({ onDepartmentDelete });

useEffect(() => {
  const fetchDepartments = async () => {
    setDepartmentLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/department`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
      })
      if(response.data.success) {
        const data = response.data.departments.map((dep, index) => (
          {
            _id: dep._id,
            sno: index + 1,
            dep_name: dep.dep_name
      }))
      setDepartments(data);
      setFilterDepartments(data);
      }
    } catch (error) {
     if (error.response && !error.response.data.success) {
    alert(error.response.data.error)
     }
  }finally{
    setDepartmentLoading(false);
  }
};
fetchDepartments();
}, []);

const filterDepartments=(e)=>{
    const records=departments.filter(dep=>dep.dep_name.toLowerCase().includes(e.target.value.toLowerCase()));
    setFilterDepartments(records);
}

  return (
    <>{departmentLoading ? <div className="flex justify-center items-center h-96"><div className="text-slate-600 font-poppins">Loading departments...</div></div>:
    <div className="p-8 bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50 min-h-screen">

      {/* Heading */}
      <div className="mb-8">
        <h3 className="text-5xl font-bold font-poppins text-slate-800 mb-2">Manage Departments</h3>
        <p className="text-slate-600 font-poppins">View and manage organization departments</p>
      </div>

      {/* Search + Add Button */}
      <div className="flex justify-between items-center mb-8 gap-4 flex-wrap">
        <input
          type="text"
          placeholder="Search by Department Name..."
          className="flex-1 min-w-0 max-w-md px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition duration-200 bg-white font-poppins"
          onChange={filterDepartments}
        />

        <Link
          to="/admin-dashboard/add-department"
          className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold font-poppins rounded-lg hover:from-cyan-600 hover:to-blue-700 transition duration-200 shadow-lg hover:shadow-xl whitespace-nowrap"
        >
          + Add Department
        </Link>
      </div>
      <div className="mt-5 bg-white rounded-xl shadow-lg border border-cyan-100 overflow-x-auto">
        <DataTable 
          columns={columns} 
          data={filteredDepartments} 
          pagination
          styles={{
            headCells: {
              style: {
                backgroundColor: '#1e293b',
                color: 'white',
                fontSize: '14px',
                fontWeight: 'bold',
              }
            },
            cells: {
              style: {
                padding: '12px 16px',
                borderBottomColor: '#e0e7ff',
              }
            },
            rows: {
              style: {
                '&:hover': {
                  backgroundColor: '#f0f9ff',
                }
              }
            }
          }}
        />
      </div>
    </div>
    }</>
  )
}

export default DepartmentList
