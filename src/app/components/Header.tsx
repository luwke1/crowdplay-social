import React from 'react';
import '../../styles/Header.css';

// Header functionality for traversing the site
const Header = () => {
    return (
        <div className='header'>
            <a href="/">Games</a>
            <a href="/profile">Friends</a>
            <a href="/recommend">Profile</a>
        </div>
    );
};

export default Header;