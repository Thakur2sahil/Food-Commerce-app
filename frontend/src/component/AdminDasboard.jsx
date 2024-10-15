import React, { useEffect, useState } from 'react';
import AdminNav from './AdminNav';
import UpdateProfile from './UpdateProfile';
import axios from 'axios';

function AdminDashboard() {
    const [username, setUsername] = useState('');
    const [image, setImage] = useState('');

    const fetchUserProfile = async () => {
        const userId = localStorage.getItem('userid');
        try {
            const res = await axios.post('http://localhost:8004/profile', { userId });
            if (res.data.length > 0) {
                const profile = res.data[0];
                setUsername(profile.username);
                setImage(profile.image);
            }
        } catch (error) {
            console.error("Error fetching user profile:", error);
        }
    };

    useEffect(() => {
        fetchUserProfile();
    }, []);

    return (
        <div>
            <AdminNav username={username} image={image} />
            <UpdateProfile 
                setUsername={setUsername} 
                setImage={setImage} 
                currentUsername={username}
                currentImage={image}
            />
        </div>
    );
}

export default AdminDashboard;
