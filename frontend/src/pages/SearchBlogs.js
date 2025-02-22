
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
                    <div key={blog._id} className="blog-card">
                        <h2 className="blog-card-title">
                            {/*  title become link */}
                            <Link to={`/blog/${blog._id}`} className="blog-card-link">
                                {blog.title}
                            </Link>
                        </h2>
                        <p className="blog-card-content">
                            {/* small portion of content will display and rest will hide */}
                            {blog.content.substring(0, 100)}...</p>
                    </div>
                ))
            )}
        </div>
    );
    
};

export default  SearchBlogs;
