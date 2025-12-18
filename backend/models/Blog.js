// 🔥 CRITICAL FIX: mongoose package-a import (require) pannanum!
const mongoose = require("mongoose"); 

const BlogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Blog", BlogSchema);