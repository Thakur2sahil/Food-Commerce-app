// routes/cartRoutes.js
const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController'); // Ensure this path is correct

// Add or update item in the cart
router.post('/cart', cartController.addToCart); // Ensure this function is defined in the controller

// Other routes...
// Increment product quantity in the cart
router.post('/cart/increment', cartController.incrementQuantity);

// Decrement product quantity in the cart
router.post('/cart/decrement', cartController.decrementQuantity);

// Get all items in the cart for a specific user
router.get('/cart/:userId', cartController.getCartItems);

// Get cart item count for a user
router.post('/cart/count', cartController.getCartCount);

// Save customer contact information
router.post('/contacts', cartController.saveCustomerContact);

// Get user profile data
router.get('/profile', cartController.getProfileData);

module.exports = router;
