const express = require('express');
const router = express.Router();
 
 
const Blog = require('../models/Blog');
// const redis = require('../config/redis');
const User = require("../models/userModel");
const  adminMiddleware = require('../middleware/adminMiddleware');
require("dotenv").config();

const API_KEY = process.env.API_KEY;
const API_URL = process.env.API_URL;
const REDIS_URL = process.env.REDIS_URL;

//  this will send API_URL and API_KEY to frontend
router.get("/config", (req, res) => {
    res.json({ API_URL,API_KEY });
});



// fetch all blogs
router.get('/', async (req, res) => {
     try{
    
    const blogs = await Blog.find().sort({ createdAt: -1 });

     
    res.json(blogs);
     }catch(error){
        console.error("Error fetching blogs:", error);
        res.status(500).json({ message: "Server Error" });
     }
});


// //  Get a single blog by  blog slug  and this will fetch the blog when u click on title on home page
router.get('/:slug',  async (req, res) => {
    try {
         
        const blog = await Blog.findOne({ slug: req.params.slug }); 
        if (!blog) {
            return res.status(404).json({ message: 'Blog Not Found' });
        }
        res.json(blog);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

//  for creating the blogs and  and only admin can  
router.post('/', adminMiddleware, async (req, res) => {
    try {
        const { title, content, author } = req.body;

        // Naya blog create karo
        const newBlog = new Blog({ title, content, author });

        // Save karne se pehle slug middleware trigger hoga
        await newBlog.save();
        // Clear cache so that new blogs appear immediately
        // redis.del("all_blogs");

        res.status(201).json(newBlog);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});


// // Delete a blog
router.delete('/:slug',adminMiddleware, async (req, res) => {
    const blog = await Blog.findOneAndDelete({ slug: req.params.slug }); 
     
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json({ message: 'Blog deleted successfully' });
});


// update a blog
router.put('/:slug', async (req, res) => {
    const { title, content, author } = req.body;

    let blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    // Update fields
    blog.title = title;
    blog.content = content;
    blog.author = author;

    await blog.save(); // Ye middleware ko trigger karega aur slug bhi update hoga

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


