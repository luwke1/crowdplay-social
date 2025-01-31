import React from 'react';

// Define header functionality for traversing the site
const Header = ()=>{
    return (
        <div className='header'>
            <a href="/">Games</a>
            <a href="/friends">Friends</a>
            <a href="/profile">Profile</a>
        </div>
    );
}



export default Header;