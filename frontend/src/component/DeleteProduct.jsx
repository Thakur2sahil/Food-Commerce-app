import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function DeleteProduct() {

    const [id,setId] = useState(0)
    const [name,setName] = useState('')
    const [price,setPrice] = useState(0)
    const [description,SetDescription] = useState('')
    const [category,setCategroy] = useState(null)
    const [image,setImage] = useState(null)
    const location = useLocation()
    const navigate = useNavigate()

    const {productid} = location.state;    
    
    const fetchproduct = async()=>{
        try {
            
            const res = await axios.post('http://localhost:8004/selectproduct',{productid})
            if (res.data ) 
            {
                const product = res.data[0]
                setId(product.id)
                setName(product.name)
                setPrice(product.price)
                SetDescription(product.description)
                setImage(product.photo)
                setCategroy(product.category)
            }
            else{
                return(
                    <div>
                         <div className='flex items-center justify-center p-5 m-5'>
          <div className='w-full max-w-6xl'>
            <h1 className='m-3 text-3xl font-bold text-center'>Product List</h1>
            <table className='min-w-full border border-gray-300 bg-gray-200'>
                <thead className='bg-gray-800 text-white'>
                    <tr>
                        <th className='px-4 py-2 border-b border-gray-300 text-center w-1/12'>Id</th>
                        <th className='px-4 py-2 border-b border-gray-300 text-center w-2/12'>Name</th>
                        <th className='px-4 py-2 border-b border-gray-300 text-center w-2/12'>Price</th>
                        <th className='px-4 py-2 border-b border-gray-300 text-center w-3/12'>Description</th>
                        <th className='px-4 py-2 border-b border-gray-300 text-center w-2/12'>Category</th>
                        <th className='px-4 py-2 border-b border-gray-300 text-center w-2/12'>Photo</th>
                        <th className='px-4 py-2 border-b border-gray-300 text-center w-2/12'>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                      <td>No data found</td>  
                    </tr>
                </tbody>
                </table>
        </div>
        </div>
                    </div>
                )
                    
                
            }

        } catch (error) {
            console.error(error)
            alert("Not able to connect with database")
        }
    }

    const handledelete = async() =>{
        try {
            const res = await axios.post('http://localhost:8004/deleteproduct',{productid})
            if(res.data)
            {
                navigate('/admin/updateproduct')
            }
            else{
                alert("No able to delete")
            }
            
        } catch (error) {
            console.error("No able to connect")
        }
    }

    useEffect(()=>{
        fetchproduct()
    },[])
    
    
    return (
        <div className='flex items-center justify-center p-5 m-5'>
          <div className='w-full max-w-6xl'>
            <h1 className='m-3 text-3xl font-bold text-center'>Product List</h1>
            <table className='min-w-full border border-gray-300 bg-gray-200'>
                <thead className='bg-gray-800 text-white'>
                    <tr>
                        <th className='px-4 py-2 border-b border-gray-300 text-center w-1/12'>Id</th>
                        <th className='px-4 py-2 border-b border-gray-300 text-center w-2/12'>Name</th>
                        <th className='px-4 py-2 border-b border-gray-300 text-center w-2/12'>Price</th>
                        <th className='px-4 py-2 border-b border-gray-300 text-center w-3/12'>Description</th>
                        <th className='px-4 py-2 border-b border-gray-300 text-center w-2/12'>Category</th>
                        <th className='px-4 py-2 border-b border-gray-300 text-center w-2/12'>Photo</th>
                        <th className='px-4 py-2 border-b border-gray-300 text-center w-2/12'>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className='px-4 py-2 border-b border-gray-300 text-center w-1/12'>{id}</td>
                        <td className='px-4 py-2 border-b border-gray-300 text-center w-1/12'>{name}</td>
                        <td className='px-4 py-2 border-b border-gray-300 text-center w-1/12'>{price}</td>
                        <td className='px-4 py-2 border-b border-gray-300 text-center w-1/12'>{description}</td>
                        <td className='px-4 py-2 border-b border-gray-300 text-center w-1/12'>{category}</td>
                        <td className='px-4 py-2 border-b border-gray-300 text-center w-1/12'><img src={`http://localhost:8004/${image}`} alt='none'  /></td>
                        <td className='px-4 py-2 border-b border-gray-300 text-center w-1/12'>
                        <button onClick={handledelete} className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex-1 mx-2'>Delete</button></td>
                    </tr>
                </tbody>
                </table>
        </div>
        </div>
    )
}

export default DeleteProduct

