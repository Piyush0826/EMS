import React from 'react'
import { NavLink } from 'react-router-dom'
import { 
  FaTachometerAlt, 
  FaUsers, 
  FaBuilding, 
  FaCalendarAlt, 
  FaMoneyBillWave, 
  FaCogs,
  FaClipboardList,
  FaFileAlt
} from 'react-icons/fa'

const AdminSidebar = () => {
  return (
    <div className="bg-gradient-to-b from-slate-900 to-slate-800 text-white h-screen fixed left-0 top-0 bottom-0 w-64 font-poppins shadow-xl">
      {/* Sidebar Header / Logo */}
      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 h-16 flex items-center justify-center shadow-lg">
        <h3 className="text-2xl font-bold tracking-wider">Employee MS</h3>
      </div>

      {/* Navigation Links */}
      <div className="px-3 py-6 space-y-2">
        <NavLink 
          to="/admin-dashboard" 
          className={({isActive}) => 
            `${isActive ? "bg-gradient-to-r from-cyan-500 to-blue-600 shadow-lg" : "hover:bg-slate-700"} flex items-center space-x-4 py-3 px-4 rounded-lg transition-all duration-200 font-medium text-white transform hover:translate-x-1`
          }
          end
        >
          <FaTachometerAlt className='text-lg' />
          <span>Dashboard</span>
        </NavLink>

        <NavLink 
          to="/admin-dashboard/employees" 
          className={({isActive}) => 
            `${isActive ? "bg-gradient-to-r from-cyan-500 to-blue-600 shadow-lg" : "hover:bg-slate-700"} flex items-center space-x-4 py-3 px-4 rounded-lg transition-all duration-200 font-medium text-white transform hover:translate-x-1`
          }
        >
          <FaUsers className='text-lg' />
          <span>Employees</span>
        </NavLink>

        <NavLink 
          to="/admin-dashboard/departments" 
          className={({isActive}) => 
            `${isActive ? "bg-gradient-to-r from-cyan-500 to-blue-600 shadow-lg" : "hover:bg-slate-700"} flex items-center space-x-4 py-3 px-4 rounded-lg transition-all duration-200 font-medium text-white transform hover:translate-x-1`
          }
        >
          <FaBuilding className='text-lg' />
          <span>Departments</span>
        </NavLink>

        <NavLink 
          to="/admin-dashboard/leaves" 
          className={({isActive}) => 
            `${isActive ? "bg-gradient-to-r from-cyan-500 to-blue-600 shadow-lg" : "hover:bg-slate-700"} flex items-center space-x-4 py-3 px-4 rounded-lg transition-all duration-200 font-medium text-white transform hover:translate-x-1`
          }
        >
          <FaCalendarAlt className='text-lg' />
          <span>Leaves</span>
        </NavLink>

        <NavLink 
          to="/admin-dashboard/salary" 
          className={({isActive}) => 
            `${isActive ? "bg-gradient-to-r from-cyan-500 to-blue-600 shadow-lg" : "hover:bg-slate-700"} flex items-center space-x-4 py-3 px-4 rounded-lg transition-all duration-200 font-medium text-white transform hover:translate-x-1`
          }
        >
          <FaMoneyBillWave className='text-lg' />
          <span>Salary</span>
        </NavLink>

        <NavLink 
          to="/admin-dashboard/attendance" 
          className={({isActive}) => 
            `${isActive ? "bg-gradient-to-r from-cyan-500 to-blue-600 shadow-lg" : "hover:bg-slate-700"} flex items-center space-x-4 py-3 px-4 rounded-lg transition-all duration-200 font-medium text-white transform hover:translate-x-1`
          }
        >
          <FaClipboardList className='text-lg' />
          <span>Attendance</span>
        </NavLink>

        <NavLink 
          to="/admin-dashboard/attendance-report" 
          className={({isActive}) => 
            `${isActive ? "bg-gradient-to-r from-cyan-500 to-blue-600 shadow-lg" : "hover:bg-slate-700"} flex items-center space-x-4 py-3 px-4 rounded-lg transition-all duration-200 font-medium text-white transform hover:translate-x-1`
          }
        >
          <FaFileAlt className='text-lg' />
          <span>Attendance Report</span>
        </NavLink>

        <NavLink 
          to="/admin-dashboard/setting" 
          className={({isActive}) => 
            `${isActive ? "bg-gradient-to-r from-cyan-500 to-blue-600 shadow-lg" : "hover:bg-slate-700"} flex items-center space-x-4 py-3 px-4 rounded-lg transition-all duration-200 font-medium text-white transform hover:translate-x-1`
          }
        >
          <FaCogs className='text-lg' />
          <span>Setting</span>
        </NavLink>
      </div>
    </div>
  )
}

export default AdminSidebar