import React, { useState } from 'react';
import Usernav from './Usernav';
import UpdateUserProfile from './UpdateUserProfile';

function ParentComponent() {
    const [username, setUsername] = useState('');
    const [image, setImage] = useState('');

    return (
        <div>
            <Usernav username={username} image={image} />
            <UpdateUserProfile setUsername={setUsername} setImage={setImage} />
        </div>
    );
}

export default ParentComponent;
