const mongoose = require('mongoose');
// Update the password here if you changed it in Atlas
const uri = "mongodb+srv://blogify:Badripr1027@cluster0.cz3gz7v.mongodb.net/blogify?retryWrites=true&w=majority";

mongoose.connect(uri)
  .then(() => console.log("✅ SUCCESS! Connected to MongoDB"))
  .catch(err => console.log("❌ FAILED! Error:", err.message));