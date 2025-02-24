import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Home.css';  

const Home = () => {
    const [blogs, setBlogs] = useState([]);
// setBlogs is a fun and when this fun will call then content will store in blogs
    useEffect(() => {
        const BACKEND_URL = process.env.REACT_APP_BACKEND_URL
        //  fetch all blogs from blogRoutes
        axios.get(`${BACKEND_URL}/api/blogs`)
            .then(response => {
                 
                setBlogs(response.data || []); 
             
            })
            .catch(error => console.error("Error fetching blogs:", error));
    },[]);

    return (
        <div className="home-container">
        
            {/* <h1 className="home-title">All Blogs</h1> */}
            {blogs.length === 0 ? (
                <p className="home-empty-message">No blogs found.</p>
            ) : (
                //  when  page are load or mount  then all blogs will  automatically fetched through useEffect and store in blogs and after that map on blogs and fetch each  blog and display blog content and title
                blogs.map(blog => (
                    <div key={blog._id} className="blog-card">
                        <h2 className="blog-card-title">
                            <Link to={`/blog/${blog._id}`} className="blog-card-link">
                                {blog.title}
                            </Link>
                        </h2>
                        <p className="blog-card-content">{blog.content.substring(0, 100)}...</p>
                    </div>
                ))
            )}
            

        </div>
    );
};

export default Home;


