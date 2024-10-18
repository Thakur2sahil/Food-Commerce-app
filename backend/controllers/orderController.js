// controllers/orderController.js
const { sendEmail } = require('../emailService');
const db = require('../db');


function generateRandomOrderId() {
    return Math.floor(Math.random() * 1000000); // Generates a random number between 0 and 999999
}

const placeOrder = async (req, res) => {
    const { userId } = req.body;
    const uniqueOrderId = generateRandomOrderId();

    try {
        // Begin transaction
        await db.query('BEGIN');

        // Get user details for email
        const userResult = await db.query('SELECT username, email, full_name FROM sahil.users WHERE id = $1', [userId]);
        if (userResult.rows.length === 0) {
            throw new Error('User not found');
        }

        const { email, full_name: fullName } = userResult.rows[0];

        // Get all cart items for the user
        const cartItemsResult = await db.query(`
            SELECT cart.id, cart.product_id, cart.quantity, products.name AS product_name, products.price
            FROM sahil.cart cart
            JOIN sahil.products products ON cart.product_id = products.id
            WHERE cart.user_id = $1
        `, [userId]);

        const cartItems = cartItemsResult.rows;

        if (cartItems.length === 0) {
            throw new Error('No items in the cart');
        }

        // Insert cart items into order_history
        for (let item of cartItems) {
            await db.query(
                'INSERT INTO sahil.order_history (order_id, user_id, quantity, status, created_at, product_id) VALUES ($1, $2, $3, $4, $5, $6)',
                [uniqueOrderId, userId, item.quantity, 'pending', new Date(), item.product_id]
            );
        }

        // Delete cart items after placing the order
        await db.query('DELETE FROM sahil.cart WHERE user_id = $1', [userId]);

        // Commit transaction
        await db.query('COMMIT');

        // Prepare email content
        const emailSubject = 'Your Order Has Been Placed';
        const emailBody = `
            Hello ${fullName},<br><br>
            We are pleased to inform you that your order with ID <strong>${uniqueOrderId}</strong> has been successfully placed.<br>
            Please wait for the admin to approve your order!<br><br>
            If you have any questions or need further assistance, please feel free to contact us.<br><br>
            Best regards,<br>
            Your Company Name
        `;

        // Send email to the user
        await sendEmail(email, emailSubject, emailBody);

        // Respond with success
        res.status(200).json({ message: 'Order placed successfully', orderId: uniqueOrderId });
    } catch (err) {
        // Rollback transaction in case of error
        await db.query('ROLLBACK');
        console.error('Error placing order:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getOrderCard = (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        console.log("No user ID available");
        return res.status(400).json({ error: "User ID is required" });
    }

    const select = `
        SELECT o.order_id, o.user_id, o.product_id, o.quantity, 
               p.photo AS photo, p.name, p.price 
        FROM sahil.order_history o 
        JOIN sahil.products p ON o.product_id = p.id 
        WHERE o.user_id = $1 AND o.status = 'pending';
    `;

    db.query(select, [userId], (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json(err);
        }
        if (data.rows && data.rows.length > 0) {
            return res.status(200).json(data.rows);
        } else {
            return res.status(404).json({ message: 'No data found' });
        }
    });
};

const deleteOrder = (req, res) => {
    const { orderId, userId } = req.body;

    const del = 'DELETE FROM sahil.order_history WHERE order_id = $1 AND user_id = $2';

    db.query(del, [orderId, userId], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Error deleting the order" });
        }
        console.log(`Order ID ${orderId} deleted for user ID ${userId}`);
        return res.status(200).json({ message: "Data deleted successfully" });
    });
};

const getOrderRequests = (req, res) => {
    const select = `
        SELECT o.order_id, o.user_id, o.product_id, o.quantity, 
               p.photo AS photo, p.name, p.price 
        FROM sahil.order_history o 
        JOIN sahil.products p ON o.product_id = p.id 
        WHERE status = 'pending';
    `;

    db.query(select, (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json(err);
        }
        if (data.rows && data.rows.length > 0) {
            return res.status(200).json(data.rows);
        } else {
            return res.status(404).json({ message: 'No data found' });
        }
    });
};

const getOrderHistory = async (req, res) => {
    try {
        const query = `
            SELECT 
                DATE_TRUNC('month', created_at) AS month, 
                COUNT(*) AS total_orders 
            FROM 
                sahil.order_history 
            WHERE 
                status = 'approved' 
            GROUP BY 
                month 
            ORDER BY 
                month ASC;
        `;

        const { rows } = await db.query(query);
        res.json(rows); // Send back the order data
    } catch (error) {
        console.error('Error fetching order history:', error);
        res.status(500).json({ message: 'Failed to fetch order history' });
    }
};

module.exports = {
    getOrderCard,
    deleteOrder,
    getOrderHistory,
    getOrderRequests,
    placeOrder
};


