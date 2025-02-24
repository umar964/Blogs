const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const User = require("../models/userModel");
const jwt  = require('jsonwebtoken');
const adminMiddleware = require("../middleware/adminMiddleware");
require("dotenv").config(); 
 
const SECRET_KEY = process.env.JWT_SECRET;
 

// Create Admin (Only 1 time)
router.post("/create-admin",adminMiddleware, async (req, res) => {
    try {
      
        const { name, email, password } = req.body;

        // Check if admin already exists with same email
        const existingAdmin = await User.findOne({email});
        if (existingAdmin) return res.status(400).json({ error: "Admin already exists!" });

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create Admin
        const adminUser = new User({ name, email, password: hashedPassword, isAdmin: true });
        await adminUser.save();

        res.json({ msg: "Admin created successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/admin-login", async (req, res) => {
    try {
        const { email, password } = req.body;
   

        // Check if admin exists in database with admin status true or not
        const adminUser = await User.findOne({ email, isAdmin: true });
       

        
        if (!adminUser) return res.status(400).json({ error: "Email or Password are Incorrect " });

        // Verify password
        const isMatch = await bcrypt.compare(password, adminUser.password);
        if (!isMatch) return res.status(400).json({ error: "Email or Password are Incorrect " });

        // Generate JWT token
        const token = jwt.sign({ id: adminUser._id, isAdmin: true }, SECRET_KEY, { expiresIn: "2h" });

        res.json({ token, msg: "Admin logged in successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/remove-admin",async(req,res)=>{
    const  {email} = req.body;
    try{
        console.log("email at admin routes",email);
        const admin = await User.findOneAndDelete({email});
         
        if(!admin){
            return res.status(400).json({ error: "Admin not found!" });
        }
        return res.json({msg:"Admin deleted successfully"});
    }catch(error){
        res.status(500).json({ error: error.message });

    }
     

})

module.exports = router;
