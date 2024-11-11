// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

// Enable CORS for all routes
app.use(cors());

// If you want to allow only specific origins (for example, only allow requests from http://localhost:5173), use:
app.use(cors({
  origin: 'http://localhost:5173', // Replace this with your frontend's URL
}));

app.use(bodyParser.json()); // Middleware to parse JSON request bodies

// Use the student routes
const studentRoutes = require('./api/routes/StudentRoutes'); // or wherever the above code is located
app.use('/api', studentRoutes);  // This prefixes all routes with /api


// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
