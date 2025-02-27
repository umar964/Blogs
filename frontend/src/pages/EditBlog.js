import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import './EditBlog.css';  

function EditBlog() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL

  useEffect(() => {
    // fetch blog by their id for update
    axios.get(`${BACKEND_URL}/api/blogs/${slug}`)
      .then(res => {
        setTitle(res.data.title);
        setContent(res.data.content);
        setAuthor(res.data.author);
      })
      .catch(err => console.error("Error fetching blog:", err));
  }, [slug]);

  const handleUpdate = (e) => {
    e.preventDefault();
    axios.put(`${BACKEND_URL}/api/blogs/${slug}`, { title, content, author })
      .then(() => navigate('/'))
      .catch(err => console.error("Error updating blog:", err));
  };

  return (
    <div className="edit-blog">
      <h1>Edit Blog</h1>
      <form onSubmit={handleUpdate}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="edit-blog-input"
          required
        />
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="edit-blog-input"
          required
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="edit-blog-textarea"
          required
        />
        <button type="submit" className="edit-blog-button">
          Update Blog
        </button>
         
      </form>
      <button 
          type="button" 
          className="cancel-blog-button" 
          onClick={() => navigate(-1)}
        >
          Cancel
        </button>
    </div>
  );
}

export default EditBlog;
