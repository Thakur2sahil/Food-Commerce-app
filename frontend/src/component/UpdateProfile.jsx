import axios from 'axios'
import React, { useEffect, useState } from 'react'

function UpdateProfile() {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [file, setFile] = useState(null)
    const [id, setId] = useState(0)

    // Fetch profile data from the server
    const fetchData = async () => {
        const userId = localStorage.getItem('userid')

        try {
            const res = await axios.post('http://localhost:8004/profile', { userId })
            if (res.data && res.data.length > 0) {
                const profile = res.data[0]
                setUsername(profile.username)
                setEmail(profile.email)
                setId(profile.id)
            } else {
                console.log("No data available")
            }
        } catch (error) {
            console.error("Error fetching data:", error)
            alert(`Error: ${error.response?.data?.message || "Unable to connect to the database"}`)
        }
    }

    // Handle form submission for updating profile
    const handleSubmit = async (e) => {
        e.preventDefault()

        const userId = localStorage.getItem('userid')
        const formData = new FormData()

        formData.append('userid', userId) // Sending userid in FormData
        formData.append('username', username) // Correct field name
        formData.append('email', email) // Correct field name
        if (file) {
            formData.append('file', file)
        }

        try {
            const res = await axios.post('http://localhost:8004/updateprofile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })
            console.log(res.data)
            if (res.data.error) {
                alert(res.data.error)
            } else {
                alert('Profile updated successfully!')
            }
        } catch (err) {
            console.error(err)
            alert("Unable to update profile")
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <div className="max-w-2xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md mt-10">
            <h1 className="text-3xl font-bold text-center mb-6">Update Profile</h1>
            <form className="bg-white p-6 rounded-lg shadow-lg space-y-4" onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Upload Image</label>
                    <input
                        type="file"
                        onChange={(e) => setFile(e.target.files[0])}
                        className="w-full p-2 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <div className="text-center">
                    <button
                        type="submit"
                        className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        Update
                    </button>
                </div>
            </form>
        </div>
    )
}

export default UpdateProfile
