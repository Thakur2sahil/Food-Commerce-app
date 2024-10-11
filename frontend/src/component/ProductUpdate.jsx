import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

function ProductUpdate() {

    const location = useLocation();

    const {productid} = location.state;


    const [image, setImage] = useState(null)
    const [category, setCategory] = useState(null)
    const [name,setName] = useState('')
    const [description,SetDescription] = useState('')
    const [price,setPrice] = useState(0)
    const [discount,setdiscount] = useState(0)

    const formdata = new FormData()

    formdata.append('name',name)
    formdata.append('price',price)
    formdata.append('description',description)
    formdata.append('discount',discount)
    formdata.append('category',category)
    if(image)
    {
        formdata.append('image',image)
    }
    formdata.append('productid', productid); 

    const handleSubmit = async(e) =>{

        e.preventDefault()
        
        try {
            
            const res = await axios.post('http://localhost:8004/upproduct',formdata ,
                {  headers: { 'Content-Type': 'multipart/form-data' },}
            )
            if(res.data)
            {
               const product = res.data[0]
               setName(product.name)
               setPrice(product.price)
               SetDescription(product.description)
               setCategory(product.category)
             setImage( product.photo)
              setdiscount( product.discount)
                fetchdata()

            }
            else{
                return(
                    <div>No data found</div>
                )
            }
            
        } catch (error) {
            alert("not able to connect with database")
        }
    }

    const fetchdata = async() =>{
        try {
            
            const res = await axios.post('http://localhost:8004/productupdate',{productid})
            if(res.data)
            {
                const product = res.data[0]
                setCategory(product.category)
                setImage(product.photo)
                setName(product.name)
                setPrice(product.price)
                setdiscount(product.discount)
                SetDescription(product.description)
            }

        } catch (error) {
            console.error(error)
            alert("Not able to connect")
        }
    }

    useEffect(()=>{
        fetchdata()
    },[])

     return(
        <div className="flex items-center justify-center mx-6  px-4 py-0">
        <div className="bg-white p-10 shadow-xl rounded-lg w-full max-w-md mt-0">
            <h1 className="text-3xl font-semibold text-center mb-4  text-gray-800">Update Product</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-2">
                    <label className="block text-sm font-medium mb-1 text-gray-700">Product Name</label>
                    <input
                        type='text'
                        name='name'
                        value={name}
                        placeholder='Enter your Product name'
                        onChange={(e)=>setName(e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1 text-gray-700">Price</label>
                    <input
                        type='number'
                        name='price'
                        value={price}
                        placeholder='Enter your product price'
                        onChange={(e)=>setPrice(e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                       
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1 text-gray-700">Upload Product Image</label>
                    <input
                        type='file'
                        onChange={(e) => setImage(e.target.files[0])}
                        className="w-full border border-gray-300 rounded-md p-1 focus:outline-none"
                    />
                </div>
                <div className="mb-2">
                    <label className="block text-sm font-medium mb-1 text-gray-700">Category</label>
                    <select
                        name='category'
                        value={category}
                        className="w-full border border-gray-300 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e)=> {setCategory(e.target.value)}}
                    >
                        <option value=''>Select a catagory</option>
                        <option value='appetizers'>Appetizers</option>
                        <option value='main course'>Main Course</option>
                        <option value='entress'>Entress</option>
                        <option value='desert'>Desert</option>
                        <option value='beverages'>Beverages</option>
                        <option value='kids'>Kid's menu</option>
                        <option value='healthy'>Healty Option</option>
                       <option value='seasonal'>Seasonal Special</option>
              
                    </select>
                </div>
                <div className="mb-2">
                    <label className="block text-sm font-medium mb-1 text-gray-700">Description</label>
                    <textarea name='description'  
                     value={description} 
                     onChange={(e)=>SetDescription(e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="mb-2">
                    <label className="block text-sm font-medium mb-1 text-gray-700">Discount</label>
                    <input
                        type='number'
                        name='discount'
                        value={discount}
                        placeholder='Enter the discount percentage'
                        onChange={(e)=>setdiscount(e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      
                    />
                </div>
                
                <div>
                    <button
                        type='submit'
                        className="w-full bg-green-500 font-semibold py-3 rounded-md hover:opacity-90 transition duration-200"
                    >
                        Update the Product
                    </button>
                </div>
            </form>
        </div>
    </div>
    )
}

export default ProductUpdate
