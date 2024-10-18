// controllers/purchaseHistoryController.js
const db = require('../db');

const getPurchaseHistory = (req, res) => {
    const { userId } = req.body;

    const selectQuery = `
        SELECT 
            o.order_id,
            o.id,
            p.photo AS photo,
            p.id AS product_id,
            o.quantity,
            o.status,
            o.rating,
            TO_CHAR(o.created_at, 'YYYY-MM-DD') AS date 
        FROM 
            sahil.order_history AS o 
        INNER JOIN 
            sahil.products AS p ON o.product_id = p.id  
        WHERE 
            o.user_id = $1
    `;

    db.query(selectQuery, [userId], (err, data) => {
        if (err) {
            console.error("Error generating purchase history:", err);
            return res.status(500).json({ error: "Error generating purchase history" });
        }
        if (data.rows.length > 0) {
            console.log(data.rows); // Log the purchase history for debugging
            return res.status(200).json(data.rows);
        } else {
            return res.status(400).json({ message: "No data found" });
        }
    });
};

module.exports = {
    getPurchaseHistory,
};
