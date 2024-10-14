import axios from 'axios';
import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';

function NewProduct() {
    const [value, setValue] = useState({
        name: '',
        price: '',
        discount: '',
        description: '',
    });

    const [image, setImage] = useState(null);
    const [category, setCategory] = useState('');

    const handleChange = (e) => {
        setValue(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleReset = () => {
        setValue({
            name: '',
            price: '',
            discount: '',
            description: '',
        });
        setImage(null);
        setCategory('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        const { name, price, description } = value;
        let errorMessage = '';

        if (!name) errorMessage += "Product name is required. ";
        if (!price) errorMessage += "Price is required. ";
        if (!description) errorMessage += "Description is required. ";
        if (!category) errorMessage += "Category is required. ";
        if (!image) errorMessage += "Product image is required. ";

        if (errorMessage) {
            toast.error(errorMessage.trim());
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', price);
        formData.append('discount', value.discount);
        formData.append('description', description);
        formData.append('image', image);
        formData.append('category', category);

        try {
            const res = await axios.post('http://localhost:8004/newproduct', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            console.log(res);
            toast.success("The food has been registered!");
            handleReset(); // Reset the form
        } catch (err) {
            console.error(err);
            toast.error("Registration failed");
        }
    };

    return (
        <div className="flex items-center justify-center mx-6 px-4">
            <div className="bg-white p-10 shadow-xl rounded-lg w-full max-w-md mt-0">
                <h1 className="text-2xl font-bold text-center mb-2 text-gray-800">Create New Product</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-2">
                        <label className="block text-sm font-medium mb-1 text-gray-700">Product Name</label>
                        <input
                            type='text'
                            name='name'
                            placeholder='Enter your Product name'
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-2">
                        <label className="block text-sm font-medium mb-1 text-gray-700">Price</label>
                        <input
                            type='number'
                            name='price'
                            placeholder='Enter your product price'
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-2">
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
                            className="w-full border border-gray-300 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value=''>Select a category</option>
                            <option value='appetizers'>Appetizers</option>
                            <option value='main course'>Main Course</option>
                            <option value='entress'>Entress</option>
                            <option value='desert'>Desert</option>
                            <option value='beverages'>Beverages</option>
                            <option value='kids'>Kid's menu</option>
                            <option value='healthy'>Healthy Option</option>
                            <option value='seasonal'>Seasonal Special</option>
                        </select>
                    </div>
                    <div className="mb-2">
                        <label className="block text-sm font-medium mb-1 text-gray-700">Description</label>
                        <textarea 
                            name='description' 
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        />
                    </div>
                    <div className="mb-2">
                        <label className="block text-sm font-medium mb-1 text-gray-700">Discount</label>
                        <input
                            type='number'
                            name='discount'
                            placeholder='Enter the discount percentage'
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <button
                            type='submit'
                            className="w-full bg-green-500 font-semibold py-3 rounded-md hover:opacity-90 transition duration-200"
                        >
                            Add the Product
                        </button>
                    </div>
                </form>
            </div>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnFocusLoss draggable pauseOnHover />
        </div>
    );
}

export default NewProduct;
