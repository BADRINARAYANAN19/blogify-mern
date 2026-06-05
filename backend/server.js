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
    }
};

connectDB();

// --- MIDDLEWARE (CORS handled once here) ---
app.use(cors({
    origin: "*", // Testing-kku "*" - appuram secure-ah mathikalam
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true 
}));

app.use(express.json());

// --- ROUTES ---
app.use("/api/auth", require("./routes/auth")); 
app.use("/api/blogs", require("./routes/blogRoutes"));

// --- PRODUCTION SETUP ---
if (process.env.NODE_ENV === 'production') {
    const buildPath = path.join(__dirname, '../frontend/build');
    app.use(express.static(buildPath));

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

module.exports = app;