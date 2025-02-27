const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const User = require("../models/userModel");
const  adminMiddleware = require('../middleware/adminMiddleware');
require("dotenv").config();

const API_KEY = process.env.API_KEY;
const API_URL = process.env.API_URL;

//  this will send API_URL and API_KEY to frontend
router.get("/config", (req, res) => {
    res.json({ API_URL,API_KEY });
});



// fetch all blogs
router.get('/', async (req, res) => {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
});


// //  Get a single blog by  blog slug  and this will fetch the blog when u click on title on home page
router.get('/:slug',  async (req, res) => {
    try {
        console.log("slug at blogRoutes",req.params.slug);
        const blog = await Blog.findOne({ slug: req.params.slug }); 
        if (!blog) {
            return res.status(404).json({ message: 'Blog Not Found' });
        }
        res.json(blog);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

//  for creating the blogs and  and only admin can create a blog
router.post('/',adminMiddleware, async (req, res) => {
    const { title, content, author } = req.body;
    const newBlog = new Blog({ title, content, author });
    await newBlog.save();
    res.status(201).json(newBlog);
});

// // Delete a blog
router.delete('/:slug',adminMiddleware, async (req, res) => {
    const blog = await Blog.findOneAndDelete({ slug: req.params.slug }); 
     
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json({ message: 'Blog deleted successfully' });
});


// update a blog
router.put('/:slug' , async (req, res) => {
    const { title, content, author } = req.body;
    const blog = await Blog.findOneAndUpdate({slug:req.params.slug},
        { title, content, author },
        { new: true } // Yeh update ke baad updated data return karega
    );
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json(blog);
});


// search a blog
router.post('/search-blogs', async (req, res) => {
     
   
    try {
      const { query } = req.body;
      
      if (!query) return res.status(400).json({ message: "Search query required" });
  
     
      const blogs = await Blog.find({ title: { $regex: query, $options: "i" } });
  
      res.json(blogs);
    } catch (error) {
      console.error("Error searching blogs:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

 

 

 

module.exports = router;


