const express = require('express'); // Import express
const multer = require('multer');  // Import multer
const { Member } = require('./models/member'); // Import Member model

const app = express(); // Initialize the express application

const upload = multer({ dest: 'uploads/' }); // Configure multer for file uploads

// Middleware to parse request body
app.use(express.urlencoded({ extended: true }));

// Define the POST route for '/members'
app.post('/members', upload.single('profilePicture'), async (req, res) => {
  const profilePicturePath = req.file ? req.file.path : null;
  const { title, name, lastName, age } = req.body;

  // Insert member data into the database
  await Member.create({ title, name, lastName, age, profilePicture: profilePicturePath });
  res.redirect('/members');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
