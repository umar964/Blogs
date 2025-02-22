const jwt = require("jsonwebtoken");

exports.authMiddleware = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;  
        next();
    } catch (error) {
        res.status(401).json({ msg: "Invalid token" });
    }
};

exports.adminMiddleware = (req, res, next) => {
    if (!req.user.isAdmin) return res.status(403).json({ msg: "Access denied, not an admin" });
    next();
};
