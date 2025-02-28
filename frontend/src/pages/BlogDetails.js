
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import './BlogDetails.css';
import { FaTrash,FaEdit,FaCopy } from "react-icons/fa";

const BlogDetails = () => {
    const { slug } = useParams();
    
    const [blog, setBlog] = useState(null);
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL

    useEffect(() => {
        axios.get(`${BACKEND_URL}/api/blogs/${slug}`)
            .then(response => {
                setBlog(response.data);
                setLoading(false);
            })
            .catch(() => {
                setError('Blog not found');
                setLoading(false);
            });
        
        axios.get(`${BACKEND_URL}/api/blogs`)
            .then(response => {
                setBlogs(response.data || []);
            })
            .catch(() => {
                setError('Error fetching blogs');
            });
    }, [slug]);
 

    const token = localStorage.getItem("token");
    const isAdmin = localStorage.getItem("isAdmin");
 

    const handleDelete = () => {
      const confirmDelete = window.confirm("Are you sure you want to delete this blog?");
      if (confirmDelete){
          axios.delete(`${BACKEND_URL}/api/blogs/${slug}`, {
              headers: { Authorization: `Bearer ${token}` },
          })
          .then(() => navigate("/"))
          .catch(err => console.error("Error deleting blog:", err));
      }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(blog.content,blog.title);
    alert("Content copied!");
};
 

  


  const relatedBlogs = blog && blogs.length > 0 ? 
    blogs.filter(b => {
        if (b.slug === blog.slug) return false; // Exclude current blog
        const blogWords = blog.title.toLowerCase().split(" "); // Split current title into words
        
       
        return blogWords.some(word => b.title.toLowerCase().includes(word)); // Check if any word matches,if yes then show them in related blogs
    }) 
    : [];

  





    // 🔹 Function to transform title into a blog link dynamically
    const transformLinks = (content) => {
        return content.replace(/\[(.*?)\]/g, (match, title) => {
            const foundBlog = blogs.find(b => b.title === title);
            if (foundBlog) {
                 
                return `[${title}](/blog/${foundBlog.slug})`; // Convert title to correct blog slug link
            }
            return match;
        });
    };
 

 

        
 

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="blog-details">
             <div className='title-div'> 
             <h1 className="blog-details-title">{blog.title}</h1>
             <div className='blog-options' >
                <Link to={`/edit/${blog.slug}`} className='opt-button'><FaEdit size={20}/></Link>
                <button onClick={handleDelete} className='opt-button'><FaTrash  size={15} textDecoration={NaN} /></button>
                {/* <Link to={`/edit/${blog.slug}`}><FaEye/></Link> */}
                <button onClick={handleCopy} className="opt-button">
                <FaCopy size={15} /> Copy
                </button>
             </div>
             </div>
            <p className="blog-details-author"><strong>Author :</strong> {blog.author}</p>

            {/* 🔹 Render markdown content with transformed links */}
            <div className="blog-details-content">
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                    {transformLinks(blog.content)}
                </ReactMarkdown>
            </div>


       

         
            {relatedBlogs.length > 0 && (
                <div className="related-blogs">
                    <h3>Related Blogs:</h3>
                    <ul>
                        {relatedBlogs.map((relatedBlog) => (
                             
                            <li key={relatedBlog._id}>
                                <Link to={`/blog/${relatedBlog.slug}`} style={{ textDecoration: "none", color: "black",fontSize: "1.2rem" }}>
                                    {relatedBlog.title}
                                </Link>
                                <p className='blog-card-content'>
                                    { relatedBlog.content.length > 100 ? relatedBlog.content.substring(0,100) + "... ":relatedBlog.content}
                                    <Link to = {`/blog/${relatedBlog.slug}` } className="read-more" style ={{color : "green",textDecoration: "none"}}>  Read More</Link>
                                </p>
                                
                            </li>
                        ))}
                    </ul>
                </div>
            )}
                   

             

            {/* Admin options */}
            {token && isAdmin === "true" && (
                <>
                    <button className="blog-details-edit-button">
                        <Link to={`/edit/${blog.slug}`} style={{ textDecoration: "none", color: "black" }}>
                            Edit Blog
                        </Link>
                    </button>
                    <button className="blog-details-delete-button" onClick={handleDelete}>
                        Delete Blog
                    </button>
                </>
            )}
        </div>
    );
};

export default BlogDetails;






