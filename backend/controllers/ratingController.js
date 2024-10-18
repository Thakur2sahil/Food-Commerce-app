// controllers/ratingController.js
const db = require('../db');

// Update rating for a specific order
const updateRating = async (req, res) => {
    const { orderId, rating } = req.body;

    try {
        await db.query('BEGIN');

        // Get current rating and rating_count
        const currentQuery = "SELECT rating, rating_count FROM sahil.order_history WHERE order_id = $1 AND status = 'approved'";
        const currentResult = await db.query(currentQuery, [orderId]);

        if (currentResult.rows.length === 0) {
            return res.status(404).json({ error: "Order not found or not approved" });
        }

        const currentRating = currentResult.rows[0].rating || 0;
        const currentCount = currentResult.rows[0].rating_count || 0;

        // Calculate the new average rating
        const newCount = currentCount + 1; // Increment count
        const newRating = (currentRating * currentCount + rating) / newCount; // New average

        // Update the database with the new rating and count
        const updateQuery = "UPDATE sahil.order_history SET rating = $1, rating_count = $2 WHERE order_id = $3 AND status = 'approved'";
        await db.query(updateQuery, [newRating, newCount, orderId]);

        await db.query('COMMIT');

        return res.status(200).json({ message: "Rating updated successfully" });
    } catch (err) {
        await db.query('ROLLBACK');
        console.error('Failed to update rating', err);
        return res.status(500).json({ error: "Failed to update rating" });
    }
};

// Submit a rating for a specific order
const submitRating = async (req, res) => {
    const { userId, orderId, rating } = req.body;

    try {
        // Fetch product_id from the order
        const orderResult = await db.query('SELECT product_id FROM sahil.order_history WHERE id = $1 AND user_id = $2', [orderId, userId]);
        if (orderResult.rows.length === 0) {
            return res.status(404).send('Order not found');
        }

        const { product_id } = orderResult.rows[0];

        // Update order history with the new rating
        await db.query('UPDATE sahil.order_history SET rating = $1 WHERE id = $2', [rating, orderId]);

        // Fetch current rating and rating count from sahil.products
        const productResult = await db.query('SELECT rating, rating_count FROM sahil.products WHERE id = $1', [product_id]);
        const { rating: currentRating, rating_count: ratingCount } = productResult.rows[0];

        // Calculate new rating and increment count
        const newRating = (currentRating * ratingCount + rating) / (ratingCount + 1);
        const newRatingCount = ratingCount + 1;

        // Update product rating and rating count
        await db.query('UPDATE sahil.products SET rating = $1, rating_count = $2 WHERE id = $3', [newRating, newRatingCount, product_id]);

        res.status(200).send('Rating submitted successfully');
    } catch (error) {
        console.error('Error submitting rating:', error);
        res.status(500).send('Server error');
    }
};

module.exports = {
    updateRating,
    submitRating,
};
