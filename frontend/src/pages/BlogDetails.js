
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import './BlogDetails.css';
import { FaCopy } from "react-icons/fa";

const BlogDetails = () => {
    const { slug } = useParams();
    
    const [blog, setBlog] = useState(null);
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [relatedBlogs,setRelatedBlogs] = useState([]);
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
                 
            });
        
        axios.get(`${BACKEND_URL}/api/blogs/all-blogs`)
            .then(response => {
                setBlogs(response.data || []);
                 
                 
            })
            .catch(() => {
                setError('Error fetching blogs');
            });
    }, [slug]);

    useEffect(()=>{
         
        if(blog && blogs.length >0){
             
            const blogWords = blog.title.toLowerCase().split(" ");
            const filtered = blogs.filter(b => {
                if (b.slug === blog.slug) return false;
                return blogWords.some(word => b.title.toLowerCase().includes(word));
            });
            setRelatedBlogs(filtered)

        }
    },[blog,blogs])
 

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
 

 

        
 

    if(loading){
        return(
            <div className="loading-indicator">
                            <p style={{fontSize:"1.3rem" }}>Loading blog...</p>
                            
                            <section  className="dots-container">
                                <div  className="dot"></div>
                                <div  className="dot"></div>
                                <div  className="dot"></div>
                                <div  className="dot"></div>
                                
                            </section>

                            
            </div>
        )
    } 
    if (error) return <p>{error}</p>;

    return (
        <div className="blog-details">
             <div className='title-div'> 
             <h1 className="blog-details-title">{blog.title}</h1>
             
             </div>

              


            <p className="blog-details-author"><strong>Author :</strong> {blog.author}</p>

           
            <div className="blog-details-content" style={{fontFamily: 'Georgia, serif'}} >
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                    {transformLinks(blog.content)}
                </ReactMarkdown>
                <div className='blog-options'  style={{}}>
                <button onClick={handleCopy} className="opt-button">    
                <FaCopy size={15} /> Copy
                </button>
             </div>
            </div>


       

         
            {relatedBlogs.length > 0 && (
                <div className="related-blogs">
                    <h2 className='you-may-like'>You may also like this</h2>
                    <ul>
                        {relatedBlogs.map((relatedBlog) => (
                             
                            <li key={relatedBlog._id} style={{marginLeft:"-30px"}}>
                                <Link to={`/blog/${relatedBlog.slug}`} className='related-blog-title' style={{ textDecoration: "none", color: "black",fontSize: "1.3rem",   }}>
                                    {relatedBlog.title}
                                </Link>
                                <p className='blog-card-content' style={{fontFamily: 'Georgia, serif', fontSize:"1.1rem",paddingLeft:"12px"}} >
                                    { relatedBlog.content.length > 100 ? relatedBlog.content.substring(0,100) + "... ":relatedBlog.content}
                                    <Link to = {`/blog/${relatedBlog.slug}` } className="read-more" >  Read More</Link>
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
                        <Link to={`/edit/${blog.slug}`} style={{ textDecoration: "none", color:"white" }}>
                            Edit Blog
                        </Link>
                    </button>
                    <button className="blog-details-delete-button" onClick={handleDelete}>
                        Delete Blog
                    </button>
                </>
            )}

               {loading && (
                <div className="loading-indicator">
                    <p style={{fontSize:"1.3rem" }}>Loading blogs...</p>
                          
                        <section  className="dots-container">
                            <div  className="dot"></div>
                            <div  className="dot"></div>
                            <div  className="dot"></div>
                            <div  className="dot"></div>
                            <div  className="dot"></div>
                        </section>

                            {/* Consider adding a spinner here */}
                        </div>
                    )}
        </div>
    );
};

export default BlogDetails;






