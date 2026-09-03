import React from 'react'
import Sidebar from '../components/EmployeeDashboard/Sidebar'
import Navbar from '../components/dashboard/Navbar'
import { Outlet } from 'react-router-dom'

const EmployeeDashboard = () => {
    return (
        <div className='flex min-h-screen'>
            {/* Fixed Sidebar */}
            <Sidebar />
            
            {/* Main Content with offset for sidebar */}
            <div className='ml-64 flex-1 flex flex-col'>
                {/* Sticky Header */}
                <Navbar />
                
                {/* Scrollable Content */}
                <div className='flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50'>
                  <Outlet /> 
                </div>
            </div>
        </div>
    )
}

export default EmployeeDashboard