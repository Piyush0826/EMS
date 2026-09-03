import React from 'react'
import { useAuth } from '../../context/authContext'

const Navbar = () => {
    const {user, logout} = useAuth()
    return (
        <div className='sticky top-0 z-40 flex items-center text-white justify-between h-16 px-8 py-4 bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600 shadow-2xl font-inter font-semibold'>
            <p className='text-xl'><span className='font-light'>Welcome,</span> <span className='font-bold'>{user.name}</span></p>
            <button onClick={logout} className='px-6 py-2 bg-white text-cyan-600 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105'>
                Logout
            </button>
        </div>
    )
}

export default Navbar

