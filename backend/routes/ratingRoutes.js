// routes/ratingRoutes.js
const express = require('express');
const { updateRating, submitRating } = require('../controllers/ratingController');

const router = express.Router();

router.post('/updaterating', updateRating); // Route to update rating
router.post('/submit-rating', submitRating); // Route to submit rating

module.exports = router;
