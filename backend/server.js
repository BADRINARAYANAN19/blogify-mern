require('dotenv').config(); 
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const app = express();

// --- DATABASE CONNECTION ---
const connectDB = async () => {
    try {
        const MONGO_URI = process.env.MONGO_URI;
        if (!MONGO_URI) {
            console.error("Critical: MONGO_URI is not defined in env variables!");
            return;
        }
        await mongoose.connect(MONGO_URI);
        console.log("MongoDB Connected 🐘");
    } catch (err) {
        console.error("MongoDB Connection Error:", err.message);
        // Serverless environment-la process.exit(1) panna koodaadhu
    }
};

// Database connect pannittu server start panna logic
connectDB();

// --- MIDDLEWARE ---
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000', 
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true 
}));
app.use(express.json());

// --- ROUTES ---
app.use("/api/auth", require("./routes/auth")); 
app.use("/api/blogs", require("./routes/blogRoutes"));

// --- PRODUCTION SETUP ---
// Vercel backend and frontend-a manage panna indha logic mukkiyam
if (process.env.NODE_ENV === 'production') {
    // Frontend build folder-a point pannanum
    const buildPath = path.join(__dirname, '../frontend/build');
    app.use(express.static(buildPath));

    // API illadha matha ella request-kum index.html anuppanum
    app.get('*', (req, res) => {
        res.sendFile(path.join(buildPath, 'index.html'));
    });
} else {
    app.get("/", (req, res) => {
        res.send("Blogify Server Running 🚀");
    });
}

// --- SERVER START ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Vercel function-kku export pannanum
module.exports = app;