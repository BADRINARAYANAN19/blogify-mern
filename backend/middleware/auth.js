// backend/middleware/auth.js
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "blogifysecret";

module.exports = (req, res, next) => {
    const token = req.header("x-auth-token");
    
    if (!token) {
        return res.status(401).json({ msg: "No token, authorization denied." });
    }

    try {
        // Decode the token. Assuming payload is structured as { user: { id: '...' } }
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Attach the user ID to the request object
        // NOTE: If payload is { id: user.id }, use: req.user = decoded; 
        // We assume nested payload based on users.js:
        req.user = decoded.user;
        
        next();
    } catch (err) {
        res.status(401).json({ msg: "Token is not valid." });
    }
};