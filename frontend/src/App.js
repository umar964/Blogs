import React, { useState } from "react";
import { Routes, Route, Link,useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import CreateBlog from "./pages/CreateBlog";
import BlogDetails from "./pages/BlogDetails";
import EditBlog from "./pages/EditBlog";
import CreateAdmin from "./pages/CreateAdmin";
import AdminLogin from "./pages/LoginAdmin";
import AdminProtected from "./pages/AdminProtected";
import './APP.css'
import axios from 'axios';
import SearchBlogs from "./pages/SearchBlogs";
import RemoveAdmin from "./pages/RemoveAdmin";
 

function App() {

  const navigate = useNavigate();
  
  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("isAdmin");
 


  // setQuery is a fun and when on it's call query content will store in query
  const [query,setQuery] = useState("");
  const [searchResults,setSearchResults] = useState([])


  const handleSearch = async (e) => {
    e.preventDefault();
    
 

    try {

      //  send the query to search-blogs in blogRoutes and fetch blogs from backend 
      const response = await axios.post("http://localhost:5000/api/blogs/search-blogs", {query});
     
    
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
           <button onClick={handleLogout}>Logout</button>
           <Link to="/remove-admin">Remove Admin</Link>
            
           </>
        )}
            <Link to = "/login-admin">Login</Link>
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
            <button id="search-btn" type="submit">Search</button>
          </form>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={
            <Home/> 
          } />

      <Route path="/search" element={
            <SearchBlogs searchResults={searchResults}/> 
          } />

        <Route path="/create-admin" element={
            <AdminProtected><CreateAdmin/></AdminProtected>
          } />
           

        <Route path="/remove-admin" element={
           <AdminProtected><RemoveAdmin/></AdminProtected>
          } />


        <Route path="/login-admin" element={<AdminLogin/>} />

        <Route path="/blog/:id" element={<BlogDetails />} />
        <Route path="/create" element={
           <AdminProtected><CreateBlog /></AdminProtected>
          } />
        <Route path="/edit/:id" element={
             <AdminProtected><EditBlog/></AdminProtected> 
          } />
      </Routes>
    </>
  );
}

export default App;



