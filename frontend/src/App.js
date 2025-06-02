import React, { useState } from "react";
import { Routes, Route, Link,useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import CreateBlog from "./pages/CreateBlog";
import BlogDetails from "./pages/BlogDetails";
import EditBlog from "./pages/EditBlog";
import CreateAdmin from "./pages/CreateAdmin";
import AdminLogin from "./pages/LoginAdmin";
import AdminProtected from "./pages/AdminProtected";
import axios from 'axios';
import SearchBlogs from "./pages/SearchBlogs";
import RemoveAdmin from "./pages/RemoveAdmin";
import MobileMenu from "./components/MobileMenu";
import './APP.css'
 

function App() {

  const navigate = useNavigate();
  
  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("isAdmin");
 


  // setQuery is a fun and when on it's call query content will store in query
  const [query,setQuery] = useState("");
  const [searchResults,setSearchResults] = useState([])
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL


  const handleSearch = async (e) => {
    e.preventDefault();
    
 

    try {

      //  send the query to search-blogs in blogRoutes and fetch blogs from backend 
      const response = await axios.post(`${BACKEND_URL}/api/blogs/search-blogs`, {query});
     
    
      setSearchResults(response.data || []);
      navigate("/search");

    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

 
  const handleLogout = () => {
    // remove the toke,isAdmin status and then redirect to login page
    localStorage.removeItem("token");  
    localStorage.removeItem("isAdmin");  
    window.location.href = "/login-admin"; 
};

 


 


  return (
    <>
      <nav>
         
         
        <div className="nav-div">
        <Link to="/">Home</Link>
        {token && isAdmin === "true" && (
          <>
           <Link to="/create">Create Blog</Link>
           <Link to="/create-admin">Create Admin</Link>
           <Link onClick={handleLogout}>Logout</Link>
           <Link to="/remove-admin">Remove Admin</Link>
            
           </>
        )}
        {!token && (
          <Link to = "/login-admin">Login</Link>
        )}
        </div>
        
        <div className="search">
        <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              className="search-input"
              placeholder="Search blogs..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
             
          </form>
          <MobileMenu/>
           
        </div>
      </nav>

       
      <Routes>

      <Route path="/" element={<Home/>} />

      <Route path="/search" element={<SearchBlogs searchResults={searchResults}/>} />

        <Route path="/create-admin" element={<AdminProtected><CreateAdmin/></AdminProtected>} />
           

        <Route path="/remove-admin" element={<AdminProtected><RemoveAdmin/></AdminProtected>} />


        <Route path="/login-admin" element={<AdminLogin/>} />

        <Route path="/blog/:slug" element={<BlogDetails/>} />

        <Route path="/create" element={<AdminProtected><CreateBlog /></AdminProtected>} />

        <Route path="/edit/:slug" element={<AdminProtected><EditBlog/></AdminProtected>} />

      </Routes>
    </>
  );
}

export default App;



