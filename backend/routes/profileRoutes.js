// routes/profileRoutes.js
const express = require('express');
const multer = require('multer');
const { getUserProfile, updateUserProfile } = require('../controllers/profileController');

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Configure multer for file uploads

router.post('/profile', getUserProfile); // Route to get user profile
router.post('/updateprofile', upload.single('file'), updateUserProfile); // Route to update user profile

module.exports = router;
