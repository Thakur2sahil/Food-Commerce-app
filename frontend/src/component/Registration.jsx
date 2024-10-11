import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';  // Import react-toastify styles

function Registration() {
    const navigate = useNavigate();

    const [value, setValue] = useState({
        name: '',
        user: '',
        email: '',
        password: ''
    });

    const [role, setRole] = useState('');
    const [img, setImg] = useState(null);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setValue(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // Validation logic
    const validateForm = () => {
        let formErrors = {};
        if (value.name.trim().length < 3) {
            formErrors.name = "Full name must be at least 3 characters long";
        }
        if (value.user.trim().length < 3) {
            formErrors.user = "Username must be at least 3 characters long";
        }
        if (!/\S+@\S+\.\S+/.test(value.email)) {
            formErrors.email = "Please enter a valid email address";
        }
        if (value.password.length < 3) {
            formErrors.password = "Password must be at least 6 characters long";
        }
        if (!role) {
            formErrors.role = "Please select a role";
        }
        if (!img) {
            formErrors.image = "Please upload an image";
        }
        return formErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const formData = new FormData();
        formData.append('name', value.name);
        formData.append('user', value.user);
        formData.append('email', value.email);
        formData.append('password', value.password);
        formData.append('role', role);
        formData.append('image', img);

        try {
            const res = await axios.post('http://localhost:8004/signup', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            // Show success toast
            toast.success("The user is registered successfully");
            navigate('/');
        } catch (err) {
            console.error(err);
            // Show error toast
            toast.error("Registration failed");
        }
    };

    return (
        <div className="flex items-center justify-center bg-gradient-to-r from-purple-600 to-blue-600 px-4">
            <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-3xl font-semibold text-center mb-6 text-gray-800">Registration Form</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1 text-gray-700">Full Name</label>
                        <input
                            type='text'
                            name='name'
                            placeholder='Enter your full name'
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1 text-gray-700">User Name</label>
                        <input
                            type='text'
                            name='user'
                            placeholder='Enter your user name'
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.user && <p className="text-red-500 text-sm">{errors.user}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
                        <input
                            type='email'
                            name='email'
                            placeholder='Enter your email'
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1 text-gray-700">Password</label>
                        <input
                            type='password'
                            name='password'
                            placeholder='Enter your password'
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1 text-gray-700">Role</label>
                        <select
                            name='role'
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value=''>Select Role</option>
                            <option value='admin'>Admin</option>
                            <option value='user'>User</option>
                        </select>
                        {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1 text-gray-700">Upload your Image</label>
                        <input
                            type='file'
                            onChange={(e) => setImg(e.target.files[0])}
                            className="w-full border border-gray-300 rounded-md p-3 focus:outline-none"
                        />
                        {errors.image && <p className="text-red-500 text-sm">{errors.image}</p>}
                    </div>
                    <div>
                        <button
                            type='submit'
                            className="w-full bg-gradient-to-r from-blue-500 to-pink-500 text-white font-semibold py-3 rounded-md hover:opacity-90 transition duration-200"
                        >
                            Register
                        </button>
                    </div>
                </form>
                <div className="mt-4 text-center">
                    <p className="text-gray-600">Already have an account? <Link to={'/'} className="text-blue-500 underline">Login Page</Link></p>
                </div>
            </div>
            {/* Toast Container to display notifications */}
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
        </div>
    );
}

export default Registration;
