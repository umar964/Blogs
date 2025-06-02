import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Home.css';  


 

const Home = () => {
    const [blogs, setBlogs] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

    const fetchBlogs = async () => {
        if (!hasMore) {
            console.log("Not fetching - no more blogs available");
            return;
        }
        
         
        setLoading(true);
        setError(null);
        
        try {
            const res = await axios.get(`http://localhost:5000/api/blogs?page=${page}&limit=5`);
 
            const fetchedBlogs = res.data.blogs;  // ye array hai
            const hasMoreBlogs = res.data.hasMore;
            
            setBlogs(prev => {
                
                const newBlogs = page === 1?fetchedBlogs:[...prev, ...fetchedBlogs];
                
                return newBlogs;
            });

            setHasMore(hasMoreBlogs);
        
        } catch (err) {
            console.error("Error loading blogs:", err);
            setError("Failed to load blogs. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    },[page,hasMore,BACKEND_URL]);

    const handleLoadMore = () => {
         
        if (hasMore) {
            setPage(prev => prev + 1);
        }
    };

    return (
        <div className="home-container">
            {error && <p className="error-message" style={{fontSize:'1.3rem', marginTop:"32vh", textAlign:"center", color:'red'}}>{error}</p>}
            
            
                    {blogs.map(blog => (
                        <Link to={`/blog/${blog.slug}`} className="full-div" key={blog._id}>
                            <div className="blog-card">
                                <h2 className="blog-card-title">{blog.title}</h2>
                                <p className="blog-card-content" style={{fontFamily: 'Georgia, serif'}}>
                                    {blog.content.length > 100
                                        ? `${blog.content.substring(0, 175)}...`
                                        : blog.content}
                                <span
                                className="read-more"
                                style={{ color: "green", textDecoration: "none", marginLeft: "5px" }}
                                >
                                Read More
                                </span>                
                                </p>
                            </div>
                        </Link>
                    ))}

                    {loading && (
                        <div className="loading-indicator">
                            <p style={{fontSize:"1.3rem" }} className='loading-text'>Loading blogs...</p>
                            
                            <section  className="dots-container">
                                <div  className="dot"></div>
                                <div  className="dot"></div>
                                <div  className="dot"></div>
                                <div  className="dot"></div>
                                
                            </section>

                  
                        </div>
                    )}

                    {!loading && hasMore && !error && (
                        <button 
                            onClick={handleLoadMore} 
                            className="load-more-btn"
                            style={{fontSize:"1.1rem",display:"block", margin:"20px auto"}}
                            disabled={loading}

                             
                        >
                            See More
                        </button>
                    )}

                    {!loading && !hasMore && blogs.length > 0 && (
                        <p className="no-more-blogs" style={{fontSize:"1.5rem",textAlign:"center", fontWeight:"600"}}>Thanks for reading 🙋‍♂️</p>
                    )}
                
            
        </div>
    );
};

export default Home;


