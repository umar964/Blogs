const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const blogRoutes = require('./Routes/blogRoutes')
const adminRoutes = require("./Routes/adminRoutes");
//  for using .env file content
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());


// cors refer to cross origin resource sharing 
// CORS allows our frontend (React) to communicate with our backend (Node.js) on a different domain (like localhost:3000 to localhost:5000).
// if cors is not enabled, the browser block the request 
app.use(cors());



//  we can  use all blogRoutes after /api/blogs and similarly with adminRoutes
app.use('/api/blogs', blogRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running...");
});

 

//  Connect to MongoDB 
mongoose.connect(process.env.MONGO_URI, {
    
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

