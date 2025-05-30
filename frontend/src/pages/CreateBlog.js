
import React, { useState,useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./CreateBlog.css"; // Import CSS file
 

const CreateBlog = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [author, setAuthor] = useState("");
    // const [apiConfig, setApiConfig] = useState({ API_KEY: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);  // To store any error message
    const navigate = useNavigate();
    const token = localStorage.getItem('token')
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL
    // const API_URL = "https://api-inference.huggingface.co/models/gpt2";
 
     

 

   
    // useEffect(() => {
    //     //  get the API_URL and API_KEY from backend .env file through config route
    //     setLoading(true);
    //     axios.get(`${BACKEND_URL}/api/blogs/config`)  
    //         .then((res) => {
    //             console.log("Backend response:", res.data);
    //             setApiConfig(res.data);
    //             setLoading(false);
    //         })
    //         .catch((err) =>{
    //             console.error("Error fetching API config:", err);
    //            setLoading(false);
    //         });
    // }, []);


    
    
 
    

 

    // Function to fetch AI-generated content

const generateContent = async () => {
  if (!title) {
    alert("Please enter a title first!");
    return;
  }

  setLoading(true);
  setError(null);

  try {
    const response = await axios.post("http://localhost:5000/api/blogs/generate-blog", {
      title,
    });

    setContent(response.data.content);
  } catch (error) {
    console.error("Error calling backend:", error);
    setError("Failed to generate blog content. Try again later.");
  }

  setLoading(false);
};







 

    

    
    

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${BACKEND_URL}/api/blogs`, {
                title,
                content:  content,   
                author,
            },
            {headers: { Authorization: `Bearer ${token}` }}
        );
            alert("Blog added successfully!");
            navigate("/");
        } catch (error) {
            console.error("Error adding blog:", error);
            setError("Error adding blog. Try again later.");
        }
    };

    return (
        <div className="create-blog-container">
            <h1 className="create-blog-title">Create New Blog</h1>
            {error && <div className="error-message">{error}</div>} {/* Display error messages */}
            <form onSubmit={handleSubmit} className="create-blog-form">
                <input
                    type="text"
                    placeholder="Enter Blog Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="create-blog-input"
                    required
                />
                <button
                    type="button"
                    onClick={generateContent}
                    className="generate-blog-button"
                    disabled={loading}
                >
                    {loading ? "Generating..." : "Generate Content"}
                </button>
                
                <textarea
                    placeholder="Content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="create-blog-textarea"
                    required
                ></textarea>
                
              
                
               

                <input
                    type="text"
                    placeholder="Author"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="create-blog-input"
                    required
                />
                <button type="submit" className="create-blog-button">
                    Submit
                </button>
            </form>
        </div>
    );
};

export default CreateBlog;






