import React from 'react'
import AdminSidebar from '../components/dashboard/AdminSidebar'
import Navbar from '../components/dashboard/Navbar'
import { Outlet } from 'react-router-dom'

const AdminDashboard = () => {
    // Note: useAuth is imported but only needed here if you use 'user' data in this specific file
    return (
        <div className='flex min-h-screen'>
            {/* Fixed Sidebar */}
            <AdminSidebar />
            
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

export default AdminDashboard