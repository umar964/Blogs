import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import './EditBlog.css';  

function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");

  useEffect(() => {
    // fetch blog by their id for update
    axios.get(`http://localhost:5000/api/blogs/${id}`)
      .then(res => {
        setTitle(res.data.title);
        setContent(res.data.content);
        setAuthor(res.data.author);
      })
      .catch(err => console.error("Error fetching blog:", err));
  }, [id]);

  const handleUpdate = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:5000/api/blogs/${id}`, { title, content, author })
      .then(() => navigate(`/blog/${id}`))
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
