import React, { useState } from 'react';
import img1 from '../admin/images/ubereats.png'; // Logo or admin image
import { Link, useNavigate } from 'react-router-dom';

function AdminNav() {

    const photo = localStorage.getItem('photo')
    const role = localStorage.getItem('role')
    const name = localStorage.getItem('name')


    const log = () =>{
            localStorage.clear()
    }
    
    
    return (
        <nav className="bg-gray-800 p-4 flex items-center justify-between">
            <div className="flex items-center">
                {/* Logo Container with Background Color */}
                <div className="bg-gray-800 p-2 rounded-full"> {/* Match the navbar background */}
                    <img src={img1} alt="Admin Logo" className="h-10 w-auto bg-gray-800 " />
                </div>
            </div>

            <div className="flex items-center mr-5">
                {/* User Profile */}
                <div className="flex items-center text-white">
                    <img src={`http://localhost:8004/${photo}`} alt="User Profile" className="h-8 w-8 rounded-full mx-3" />
                    <h2 className="text-lg mx-3">{name}</h2>
                </div>
                {/* Logout Button */}
                <Link to={'/'} ><button className="bg-red-500 hover:bg-red-600 ml-3 text-white font-semibold py-2 px-4 rounded-md" onClick={log}>
                    Logout
                </button></Link>
            </div>
        </nav>
    );
}

export default AdminNav;

