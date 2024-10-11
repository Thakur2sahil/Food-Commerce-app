import React from 'react';
import img from '../admin/images/ub.jfif'
import img1 from '../admin/images/ubereats.png'

function Contact() {
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">

            <div className="flex flex-col md:flex-row bg-white shadow-md rounded-lg max-w-5xl w-full">


                <div className="p-8 flex-[0.6]">
                    <div className="flex items-center mb-4">

                        <img src={img1} alt="ubereats logo" className="w-10 h-10 mr-2" />
                        <h1 className="font-bold text-lg">UberEats</h1>
                    </div>
                    <h2 className="text-xl font-semibold">Restaurant Partner App</h2>
                    <p className="text-gray-600 mt-2">
                        We are a one-stop solution for managing orders, menus, trading business growth, and creating promos and discounts for restaurants.
                    </p>
                    <div className="mt-6">
                        <h3 className="text-2xl font-bold mb-4">Welcome to Our Restaurant</h3>
                        <p className="text-gray-600">
                            We are committed to providing you with the best dining experience. Whether you're here for a quick bite or a full meal, we have something for everyone. Enjoy our delicious food and excellent service.
                        </p>
                    </div>
                </div>

                {/* Image */}
                <div className="flex-shrink-0">
                    <img
                        src={img}
                        alt="Restaurant Food"
                        className="rounded-tr-lg rounded-br-lg w-full h-auto object-cover mt-4"
                    />
                </div>
            </div>

            {/* Right Section (Contact Form) */}
            <div className="ml-0 md:ml-10 mt-10 md:mt-0 bg-white p-8 shadow-md rounded-lg max-w-md w-full">
                <h2 className="text-2xl font-bold mb-6">Contact Us</h2>
                <form>
                    <div className="mb-4">
                        <label className="block text-gray-700">Name</label>
                        <input type="text" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-500" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Email</label>
                        <input type="email" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-500" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Favorite Food</label>
                        <input type="text" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-500" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Message</label>
                        <textarea className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-500" rows="4"></textarea>
                    </div>
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Contact;
