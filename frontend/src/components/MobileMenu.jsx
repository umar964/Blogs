import React, { useState } from 'react'
import './MobileMenu.css';
import { Link } from 'react-router-dom';


const MobileMenu = () => {

    const [menuOpen,setMenuOpen] = useState(false);
  

    const token = localStorage.getItem("token");
    const isAdmin = localStorage.getItem("isAdmin");

    const handleLogout = () => {
    // remove the toke,isAdmin status and then redirect to login page
    localStorage.removeItem("token");  
    localStorage.removeItem("isAdmin");  
    window.location.href = "/login-admin"; 
  };
 

 



    return(
            <>
            <button className='menu-toggle' onClick={()=>setMenuOpen(!menuOpen)} >
                ☰
            </button>

            {menuOpen  &&(
            <div className="mobile-menu" onClick={() => setMenuOpen(false)}>
            <button>✕</button>
            <ul>
            <li><Link to="/">Home</Link></li>
            {token && isAdmin === "true" && (
            <>
            <li><Link to="/create">Create Blog</Link></li>
             <li><Link to="/create-admin">Create Admin</Link></li>
             <li><Link to="/remove-admin">Remove Admin</Link></li>
             <li><Link onClick={handleLogout}>Logout</Link></li>
             </>
             )}
             
              {!token &&(
                <li><Link to="/login-admin">Admin Login</Link></li>
              )}
             </ul>
            </div>       
            )}
            </>
    )

    }
   


export default MobileMenu;