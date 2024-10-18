    // routes/userRoutes.js
const express = require('express');
const {
    getNotApprovedUsers,
    acceptUser,
    cancelUser,
} = require('../controllers/userController');

const router = express.Router();

router.get('/not-approved', getNotApprovedUsers); // Get not approved users
router.post('/accept', acceptUser);               // Accept user
router.post('/cancel', cancelUser);               // Cancel user

module.exports = router;
