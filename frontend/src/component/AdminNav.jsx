import React, { useEffect, useState } from 'react';
import img1 from '../admin/images/ubereats.png'; // Logo or admin image
import { Link, useNavigate } from 'react-router-dom';

function AdminNav({ username, image }) {
    const navigate = useNavigate();

    console.log(username)

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <nav className="bg-gray-800 p-4 flex items-center justify-between">
            <div className="flex items-center">
                <div className="bg-gray-800 p-2 rounded-full">
                    <img src={img1} alt="Admin Logo" className="h-10 w-auto" />
                </div>
            </div>

            <div className="flex items-center mr-5">
                <span className='hover:underline cursor-pointer text-lg mx-3 text-white font-semibold'>
                    <Link to={'/admin/updateprofile'}>User Profile</Link>
                </span>
                <div className="flex items-center text-white">
                    <img src={`http://localhost:8004/${image}`} alt="User Profile" className="h-8 w-8 rounded-full mx-3" />
                    <h2 className="text-lg mx-3">{username}</h2>
                </div>
                <button 
                    className="bg-red-500 hover:bg-red-600 ml-3 text-white font-semibold py-2 px-4 rounded-md" 
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>
        </nav>
    );
}

export default AdminNav;
