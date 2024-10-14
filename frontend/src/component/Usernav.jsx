import React, { useEffect, useState } from 'react';
import img from '../admin/images/ubereats.png';
import cartIcon from '../admin/images/trolley.png';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaShoppingCart } from 'react-icons/fa';

function Usernav({ cartCount, setCartCount,setSearchTerm  }) {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [name, setName] = useState('');

  const userId = localStorage.getItem('userid');

  const fetchData = async () => {
    try {
      console.log("Fetching profile for userId:", userId);
      const res = await axios.post('http://localhost:8004/profile', { userId });
      
      if (res.data.length > 0) {
        const profile = res.data[0];
        setImage(profile.image);
        setName(profile.username);
        console.log(profile);
      } else {
        console.log("No profile data returned");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const cart = async () => {
    try {
      const res = await axios.post('http://localhost:8004/cartCount', { userId });
      if (res.data) {
        setCartCount(res.data.count);
        console.log(res.data.count);
      } else {
        console.log("No data returned");
      }
    } catch (error) {
      console.error("Error fetching cart count:", error);
    }
  };

  useEffect(() => {
    fetchData();
    cart();
  }, []);

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
                  <input
                    type='search'
                    className='outline-none text-black px-2 py-1 rounded'
                    placeholder='Search dishes...'
                    onChange={handleSearchChange}
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
            <Link to="/user/cart" className="relative">
              <FaShoppingCart className="text-white text-2xl" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">{cartCount}</span>
              )}
            </Link>
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
