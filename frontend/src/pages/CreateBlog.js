
import React, { useState,useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./CreateBlog.css"; // Import CSS file
 

const CreateBlog = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [author, setAuthor] = useState("");
    const [apiConfig, setApiConfig] = useState({ API_URL: "", API_KEY: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);  // To store any error message
    const navigate = useNavigate();
    const token = localStorage.getItem('token')
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL

 

   
    useEffect(() => {
        //  get the API_URL and API_KEY from backend .env file through config route
        axios.get(`${BACKEND_URL}/api/blogs/config`)  
            .then((res) => setApiConfig(res.data))
            .catch((err) => console.error("Error fetching API config:", err));
    }, []);


    
    
 
    

 

    // Function to fetch AI-generated content
    const generateContent = async () => {
    
        if (!title) {
            alert("Please enter a title first!");
            return;
        }

        if (!apiConfig.API_URL || !apiConfig.API_KEY) {
            alert("API config not loaded");
            return;
        }
    
        setLoading(true);
    
        try {
            const response = await axios.post(apiConfig.API_URL,
                 
                {
                    inputs: `Write a blog on ${title} as if you are casually sharing your thoughts with a friend. Use simple words, personal opinions, and a natural flow. Add humor, questions, and a mix of short and long sentences. Avoid making it sound robotic or overly structured. Don't include this title in the content.`
                },
                
                
                {
                    headers: {
                        Authorization: `Bearer ${apiConfig.API_KEY}`,
                        "Content-Type": "application/json"
                    }
                }
            );
    
            
            if (response.data && response.data[0]?.generated_text) {
                setContent(response.data[0].generated_text);
            } else {
                setContent("No content generated. Please try again.");
            }
        } catch (error) {
            console.error("Error generating blog:", error.response || error);
    
             
           
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
            navigate(`/blog/${response.data._id}`);
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






