// controllers/userController.js
const db = require('../db');
const { sendEmail } = require('../emailService');

// Get users not approved
const getNotApprovedUsers = async (req, res) => {
    try {
        const query = "SELECT * FROM sahil.users WHERE approved = 'false'";
        const { rows } = await db.query(query);
        console.log(rows);
        
        return res.status(200).json(rows);
    } catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

// Accept user
const acceptUser = async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json("User ID is required");
    }

    const updateQuery = "UPDATE sahil.users SET approved = true WHERE id = $1 RETURNING username, email";

    try {
        const { rows } = await db.query(updateQuery, [userId]);
        console.log(rows);

        if (rows.length === 0) {
            return res.status(404).json("No matching record found");
        }

        const { username, email } = rows[0];

        // Sending email notification after successful update
        await sendEmail(
            email,
            'User Approved',
            `
            <p>Hello ${username},</p>
            <p>Your account has been approved successfully.</p>
            <p>Thank you for your patience!</p>
            `
        );

        return res.status(200).json("Update successful");

    } catch (err) {
        console.error("Database error:", err);
        return res.status(500).json("Database error");
    }
};

// Cancel user
const cancelUser = async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json("User ID is required");
    }

    const deleteQuery = "DELETE FROM sahil.users WHERE id = $1 RETURNING email, username";

    try {
        const { rows } = await db.query(deleteQuery, [userId]);

        if (rows.length === 0) {
            return res.status(404).json("No user found with that ID");
        }

        const { email, username } = rows[0];

        // Sending email notification after successful deletion
        await sendEmail(
            email,
            'Account Cancellation',
            `
            <p>Hello ${username},</p>
            <p>Your account has been successfully canceled.</p>
            <p>If you have any questions, please contact us.</p>
            `
        );

        return res.status(200).json("User deleted successfully");

    } catch (err) {
        console.error("Database error:", err);
        return res.status(500).json("Database error");
    }
};

module.exports = {
    getNotApprovedUsers,
    acceptUser,
    cancelUser,
};
