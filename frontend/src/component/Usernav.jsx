import React from 'react'
import img from '../admin/images/ubereats.png'
import img1 from '../admin/images/sahil.jpg'
import { Link, useNavigate } from 'react-router-dom'


function Usernav() {

    const navigate = useNavigate()
    const image = localStorage.getItem('photo')
    const role = localStorage.getItem('role')
    const name = localStorage.getItem('name')

    const handlelog = () =>{
        localStorage.clear()
        navigate('/')
    }
        
    return (
        <div className='flex items-center justify-center w-screen'>
            <div className='w-full bg-black '>
                <nav className=' px-2 py-2 text-white flex items-center '>
                    <div className='start-0'>
                        <img src={img} alt='#' className='bg-black w-20 h-20 '/>
                    </div>
                    <div className='flex  ml-14 w-8/12'>
                        <ul className='flex items-center justify-evenly space-x-6'>
                            <li className=' hover:underline cursor-pointer'><Link to={'/user/userhome'} >Home</Link></li>
                            <li className='hover:underline cursor-pointer'><Link to={'/user/about'}  >About</Link></li>
                            <li className=' hover:underline cursor-pointer'><Link to={'/user/contact'}  >Contact</Link></li>
                            <li className=' ' ><input type="search" className='outline-none text-black  px-2 py-1 rounded' /></li>
                        </ul>
                    </div>
                    <div className='flex items-center space-x-4 mx-3'>
        <img src={`http://localhost:8004/${image}`} alt={name} className='w-12 h-12 rounded-full'/>
        <span>{name}</span>
        <span className='hover:underline cursor-pointer'><Link to={'/user/cart'}>Cart</Link></span>
        <button className='px-4 py-2 bg-red-500 rounded hover:bg-red-600' onClick={handlelog}>Logout</button>
      </div>
                </nav>
            </div>
        </div>
    )
}

export default Usernav
