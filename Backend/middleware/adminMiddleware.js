const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
require("dotenv").config();  

const SECRET_KEY = process.env.JWT_SECRET;

const adminMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1]; 
        if (!token) {
            return res.status(401).json({ msg: "Unauthorized! No token provided" });
        }
       

        const decoded = jwt.verify(token, SECRET_KEY); // Decode token
        const user = await User.findById(decoded.id);

        if (!user || !user.isAdmin) {
            return res.status(403).json({ msg: "Only admin can perform this action!" });
        }

        req.user = user;  
        next();
    } catch (error) {
        res.status(401).json({ msg: "Invalid or expired token!" });
    }
};

module.exports = adminMiddleware;

