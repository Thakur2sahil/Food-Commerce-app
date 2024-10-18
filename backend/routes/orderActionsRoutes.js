// routes/orderActionsRoutes.js
const express = require('express');
const { acceptOrder, cancelOrder } = require('../controllers/orderActionsController');

const router = express.Router();

router.post('/accept', acceptOrder); // Route to accept an order
router.post('/cancel', cancelOrder);  // Route to cancel an order

module.exports = router;
