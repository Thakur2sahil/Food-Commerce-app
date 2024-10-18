// controllers/profileController.js
const db = require('../db');

const getUserProfile = (req, res) => {
    const { userId } = req.body;
    const select = 'SELECT * FROM sahil.users WHERE id = $1;';

    db.query(select, [userId], (err, data) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: "Database error" });
        }

        if (data.rows.length > 0) {
            return res.status(200).json(data.rows[0]); // Return the first user as response
        } else {
            return res.status(404).json({ message: "No data available" });
        }
    });
};

const updateUserProfile = (req, res) => {
    const { userid: userId, username, email } = req.body;

    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }

    const updateFields = [];
    const values = [];

    if (username) {
        updateFields.push(`username = $${values.length + 1}`);
        values.push(username);
    }
    if (email) {
        updateFields.push(`email = $${values.length + 1}`);
        values.push(email);
    }

    if (req.file) {
        const filename = `uploads/${req.file.filename.replace(/\\/g, "/")}`;
        updateFields.push(`image = $${values.length + 1}`);
        values.push(filename);
    }

    if (updateFields.length > 0) {
        const updateQuery = `UPDATE sahil.users SET ${updateFields.join(', ')} WHERE id = $${values.length + 1}`;

        db.query(updateQuery, [...values, userId], (err) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: "Database error" });
            }

            // Fetch the updated user details
            const fetchQuery = `SELECT username, email, image FROM sahil.users WHERE id = $1`;
            db.query(fetchQuery, [userId], (err, result) => {
                if (err) {
                    console.error('Error fetching user data:', err);
                    return res.status(500).json({ error: "Error fetching user data" });
                }

                if (result.rows.length === 0) {
                    return res.status(404).json({ error: "User not found" });
                }

                const updatedUser = result.rows[0];
                return res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
            });
        });
    } else {
        return res.status(400).json({ error: "No fields to update" });
    }
};

module.exports = { getUserProfile, updateUserProfile };
