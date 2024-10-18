// controllers/orderActionsController.js
const db = require('../db');
const { sendEmail } = require('../emailService');

const acceptOrder = async (req, res) => {
    const { orderId } = req.body;

    if (!orderId) {
        return res.status(400).json({ error: "orderId is required" });
    }

    try {
        // Update order status to 'approved' and get the associated user ID
        const updateQuery = "UPDATE sahil.order_history SET status = 'approved' WHERE order_id = $1 RETURNING user_id";
        const { rows } = await db.query(updateQuery, [orderId]);

        if (rows.length === 0) {
            return res.status(404).json({ error: "Order not found" });
        }

        const userId = rows[0].user_id;

        // Fetch user details based on user ID
        const userQuery = "SELECT username, email, full_name FROM sahil.users WHERE id = $1";
        const userResult = await db.query(userQuery, [userId]);

        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const { email, full_name: fullName } = userResult.rows[0];

        // Prepare and send email notification
        const emailSubject = 'Your Order Has Been Approved';
        const emailBody = `
            Hello ${fullName},<br><br>
            We are pleased to inform you that your order with ID ${orderId} has been approved.<br>
            Thank you for your purchase!<br>
            If you have any questions, feel free to contact us.<br><br>
            Best regards,<br>
            Your Company Name
        `;

        await sendEmail(email, emailSubject, emailBody);

        return res.status(200).json({ message: "Order has been approved and user notified" });
    } catch (error) {
        console.error("Error processing request:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const cancelOrder = async (req, res) => {
    const { orderId } = req.body;

    if (!orderId) {
        return res.status(400).json({ error: "Order ID is required" });
    }

    try {
        // Update order status to 'canceled' and get the associated user ID
        const updateQuery = "UPDATE sahil.order_history SET status = 'canceled' WHERE order_id = $1 RETURNING user_id";
        const { rows } = await db.query(updateQuery, [orderId]);

        if (rows.length === 0) {
            return res.status(404).json({ error: "Order not found" });
        }

        const userId = rows[0].user_id;

        // Fetch user details based on user ID
        const userQuery = "SELECT username, email, full_name FROM sahil.users WHERE id = $1";
        const userResult = await db.query(userQuery, [userId]);

        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const { email, full_name: fullName } = userResult.rows[0];

        // Prepare and send email notification
        const emailSubject = 'Your Order Has Been Canceled';
        const emailBody = `
            Hello ${fullName},<br><br>
            We regret to inform you that your order with ID ${orderId} has been canceled.<br>
            If you have any questions, feel free to contact us.<br><br>
            Best regards,<br>
            Your Company Name
        `;

        await sendEmail(email, emailSubject, emailBody);

        // Optionally remove the canceled order from history
        await db.query("DELETE FROM sahil.order_history WHERE order_id = $1", [orderId]);

        return res.status(200).json({ message: "Order has been canceled and user notified" });
    } catch (error) {
        console.error("Error processing request:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = {
    acceptOrder,
    cancelOrder,
};
