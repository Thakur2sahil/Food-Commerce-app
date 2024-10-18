// routes/orderRoutes.js
const express = require('express');
const { placeOrder ,getOrderCard,
    deleteOrder,
    getOrderRequests,getOrderHistory} = require('../controllers/orderController');


const router = express.Router();

router.post('/place', placeOrder); // Route to place an order
router.post('/ordercard', getOrderCard); // Route to get user-specific orders
router.post('/orderdel', deleteOrder);    // Route to delete an order
router.post('/orderreq', getOrderRequests);
router.get('/order-history', getOrderHistory);

module.exports = router;
