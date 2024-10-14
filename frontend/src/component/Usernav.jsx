import React, { useEffect, useState } from 'react';
import img from '../admin/images/ubereats.png';
import cartIcon from '../admin/images/trolley.png';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Usernav({ setSearchTerm }) {
  const navigate = useNavigate();
  const [image,setImage]=useState(null);
  const [name,setName]=useState('')

  const userId = localStorage.getItem('userid')

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

  const handleLog = () => {
    localStorage.clear();
    navigate('/');
  };

  // Function to handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  return (
    <div className='max-w-full mx-auto flex items-center justify-center w-screen'>
      <div className='w-full bg-black'>
        <nav className='px-2 py-2 text-white flex items-center justify-between'>
          <div className='flex items-center'>
            <img src={img} alt='#' className='bg-black w-20 h-20' />
            <div className='flex ml-14 w-8/12'>
              <ul className='flex items-center justify-evenly space-x-6'>
                <li className='hover:underline cursor-pointer'>
                  <Link to={'/user/userhome'}>Home</Link>
                </li>
                <li className='hover:underline cursor-pointer'>
                  <Link to={'/user/about'}>About</Link>
                </li>
                <li className='hover:underline cursor-pointer'>
                  <Link to={'/user/contact'}>Contact</Link>
                </li>
                <li className=''>
                  {/* Search bar */}
                  <input
                    type='search'
                    className='outline-none text-black px-2 py-1 rounded'
                    placeholder='Search dishes...'
                    onChange={handleSearchChange} // Update search term on change
                  />
                </li>
              </ul>
            </div>
          </div>
          <div className='flex items-center space-x-8'>
          <span className='hover:underline cursor-pointer'>
              <Link to={'/user/uerupdateprofile'}>User Profile</Link>
            </span>
            <img src={`http://localhost:8004/${image}`} alt={name} className='w-12 h-12 rounded-full' />
            <span>{name}</span>
            <span className='hover:underline cursor-pointer'>
            <Link to={'/user/cart'}>
                            <img src={cartIcon} alt="Cart" className='w-8 h-8 cursor-pointer' />
                        </Link>
            </span>
            <button className='px-4 py-2 bg-red-500 rounded hover:bg-red-600' onClick={handleLog}>
              Logout
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}

export default Usernav;
