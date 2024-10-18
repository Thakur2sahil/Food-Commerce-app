    // routes/purchaseHistoryRoutes.js
const express = require('express');
const { getPurchaseHistory } = require('../controllers/purchaseHistoryController');

const router = express.Router();

router.post('/', getPurchaseHistory); // Route to get purchase history

module.exports = router;
