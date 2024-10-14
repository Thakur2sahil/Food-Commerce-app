import React, { useEffect, useState } from 'react';
import img1 from '../admin/images/ubereats.png'; // Logo or admin image
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function AdminNav() {

    const userId = localStorage.getItem('userid');
    const navigate = useNavigate();
    const [image,setImage]=useState(null);
    const [name,setName]=useState('')

  const fetchData = async () => {
    try {
        console.log("Fetching profile for userId:", userId); // Log the userId
        const res = await axios.post('http://localhost:8004/profile', { userId });
        
        if (res.data.length > 0) {
            const profile = res.data[0]; // Assuming you're fetching one user
            setImage(profile.image);
            setName(profile.username);
            console.log(profile);
        } else {
            console.log("No profile data returned"); // Log when no data is returned
        }
    } catch (error) {
        console.error("Error fetching profile:", error); // Log the error
    }
};
 
 
  useEffect(()=>{
    fetchData()
  },[])



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
                <span className='hover:underline cursor-pointer text-lg mx-3 text-white font-semibold '>
              <Link to={'/admin/updateprofile'}>User Profile</Link>
            </span>
                <div className="flex items-center text-white">
                    <img src={`http://localhost:8004/${image}`} alt="User Profile" className="h-8 w-8 rounded-full mx-3" />
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

