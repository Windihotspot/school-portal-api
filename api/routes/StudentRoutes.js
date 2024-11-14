// routes/studentRoutes.js
const express = require('express');
const db = require('../../db'); 
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const AWS = require('aws-sdk');


// Configure multer for file upload handling
const upload = multer();

// Configure AWS SDK
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,    // Set these environment variables
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION                 // Specify your bucket's region
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME;   // Name of your S3 bucket

// Route to add a new student
router.post('/students', upload.single('profile_image'), async (req, res) => {
  try {
    const { name, email, age, gender, studentClass } = req.body;
    const profileImage = req.file; // Access the uploaded file
    const verification_token = uuidv4(); // Generate a verification token

    let profileImageUrl = null;
    if (profileImage) {
      // Define S3 upload parameters
      const s3Params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `students/${Date.now()}_${profileImage.originalname}`, // Unique file name in S3
        Body: profileImage.buffer,
        ContentType: profileImage.mimetype,
        ACL: 'public-read' // Set to 'private' if you don't want public access
      };

      // Upload to S3
      const s3Response = await s3.upload(s3Params).promise();
      profileImageUrl = s3Response.Location; // S3 URL of the uploaded image
    }

    // Insert query to add a new student (store image URL instead of binary data)
    const query = `
      INSERT INTO students (name, email, age, gender, studentClass, profile_image, verification_token, is_verified)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.execute(query, [
      name,
      email,
      age,
      gender,
      studentClass,
      profileImageUrl, // Store S3 URL here
      verification_token,
      false // is_verified set to false by default
    ]);

    res.status(201).json({ message: 'Student added successfully', studentId: result.insertId });
  } catch (error) {
    console.error('Error adding student:', error);
    res.status(500).json({ error: 'Failed to add student' });
  }
});

module.exports = router;
