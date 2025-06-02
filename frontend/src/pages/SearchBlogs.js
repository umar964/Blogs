
import { Link } from 'react-router-dom';
import './Home.css';  

const  SearchBlogs = ({searchResults}) => {
    // this page is taking searchResults from app.js and display here

    return (
         <div className="home-container">
        {searchResults.length === 0 ? (
                <p className="home-empty-message">No result found.</p>
            ) : (
                searchResults.map(blog => (
                     <Link to={`/blog/${blog.slug}`} key={blog._id} className='full-div'>
                     <div   className="blog-card">
                        <h2 className="blog-card-title">
                            {blog.title}
                            
                        </h2>
                        <p className="blog-card-content"  style={{fontFamily: 'Georgia, serif'}}>
                            {/* small portion of content will display and rest will hide */}
                            {blog.content.substring(0, 175)}...
                             <span
                                className="read-more"
                                style={{ color: "green", textDecoration: "none", marginLeft: "5px" }}
                                >
                                Read More
                                </span> 
                            </p>
                    </div>
                     </Link>
                ))
            )}
        </div>
    );
    
};

export default  SearchBlogs;
