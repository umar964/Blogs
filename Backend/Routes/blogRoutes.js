const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const User = require("../models/userModel");
const axios = require('axios');
const OpenAI = require('openai');
const  adminMiddleware = require('../middleware/adminMiddleware');
 const DEEPINFRA_KEYs = process.env.DEEPINFRA_KEY;
 

 
 
// for related blogs in blogDetails page
 router.get("/all-blogs",async(req,res)=>{

   try{
    const allBlogs = await Blog.find().sort({ createdAt:-1 })
    res.json(allBlogs);
     }catch(error){
        console.error("Error fetching blogs:", error);
        res.status(500).json({ message: "Server Error" });
     }

 })


// fetch all blogs for landing page
router.get("/", async (req, res) => {

  
 
   

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = (page - 1) * limit;

  

     try{
    const blogs = await Blog.find()
      .sort({ createdAt:-1 })
      .skip(skip)
      .limit(limit+1);
     

     
    const hasMore = blogs.length > limit;
    const results = hasMore ? blogs.slice(0, limit) : blogs;
     
 
    res.json({
      blogs:results,
      hasMore
    });
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


 

 


 

 

router.post("/generate-blog", async (req, res) => {
  const { title } = req.body;
  
  const DEEPINFRA_URL = "https://api.deepinfra.com/v1/openai/chat/completions";
  const DEEPINFRA_KEY='287X0dBhcRzcMRT21nV8qtt7mnE3zlTr';
  // const DEEPINFRA_KEY = process.env.DEEPINFRA_KEY; // Get from https://deepinfra.com/
  
 
  try {

    const response = await axios.post(
      DEEPINFRA_URL,
      {
        model: "mistralai/Mistral-7B-Instruct-v0.1",
        messages: [{
          role: "user",
          content: `Write a detailed blog post about "${title}" in Markdown .`
        }],
        max_tokens: 1000
      },
      {
        headers: {
          "Authorization": `Bearer ${DEEPINFRA_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );
     
    res.json({ content: response.data.choices[0].message.content });
  } catch (error) {
    console.error("DeepInfra Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to generate blog." });
  }
});

 


 

 

 

module.exports = router;


