// routes/studentRoutes.js
const express = require('express');
const db = require('../../db'); 
const router = express.Router();
const { v4: uuidv4 } = require('uuid'); // UUID for unique token generation

// Route to add a new student
router.post('/students', async (req, res) => {
  try {
    const { name, email, age, gender, studentClass, profile_image } = req.body;
    console.log("request body:", req.body)
    // Generate a verification token
    const verification_token = uuidv4();
    console.log("verfication token:",)
    

    // Insert query to add a new student
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
      profile_image,
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
