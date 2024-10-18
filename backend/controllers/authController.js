// controllers/authController.js
const jwt = require('jsonwebtoken');
const db = require('../db');
const { sendEmail } = require('../emailService');
const secretKey = 'your_secret_key';

const sendOtp = async (req, res) => {
    const { userId } = req.body;
    try {
        const user = await db.query('SELECT * FROM sahil.users WHERE id = $1', [userId]);
        
        if (user.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userEmail = user.rows[0].email;
        const username = user.rows[0].username;

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await db.query('UPDATE sahil.users SET otp = $1, otp_expires_at = $2 WHERE id = $3', [
            otp,
            new Date(Date.now() + 15 * 60 * 1000),
            userId,
        ]);

        await sendEmail(
            userEmail,
            'Your OTP Code',
            `<p>Hello ${username},</p>
             <p>Your OTP code is <strong>${otp}</strong>.</p>
             <p>This code is valid for 15 minutes. Please do not share it with anyone.</p>
             <p>Thank you!</p>`
        );

        res.status(200).json({ message: 'OTP sent successfully to your email' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


// Reset password using OTP
const resetPassword = async (req, res) => {
    const { otp, newPassword } = req.body;

    try {
        const user = await db.query('SELECT * FROM sahil.users WHERE otp = $1', [otp]);

        if (user.rows.length === 0) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        // Update the user's password
        await db.query('UPDATE sahil.users SET password = $1 WHERE otp = $2', [newPassword, otp]);

        // Clear OTP and expiry
        await db.query('UPDATE sahil.users SET otp = NULL, otp_expires_at = NULL WHERE otp = $1', [otp]);

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Get user profile
const getProfile = async (req, res) => {
    const { userId } = req.body;

    try {
        const select = 'SELECT * FROM sahil.users WHERE id = $1;';
        const { rows } = await db.query(select, [userId]);

        if (rows.length > 0) {
            return res.status(200).json(rows[0]); // Return the first row as profile data
        } else {
            return res.status(404).json({ message: "No data available" });
        }
    } catch (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: "Database error" });
    }
};



const signup = async (req, res) => {
    try {
        const imgpath = `uploads/${req.file.filename.replace(/\\/g, "/")}`;
        const { fullName, username, email, password, role } = req.body;

        // Check if the email already exists
        const checkEmailQuery = 'SELECT * FROM sahil.users WHERE email=$1';
        const emailResult = await db.query(checkEmailQuery, [email]);

        if (emailResult.rows.length > 0) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        // Insert the user data
        const insertQuery = `
            INSERT INTO sahil.users (full_name, username, email, password, role, image)
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
        const insertResult = await db.query(insertQuery, [fullName, username, email, password, role, imgpath]);

        const newUser = insertResult.rows[0];

        // Create a JWT token with the user's role
        const payload = {
            id: newUser.id,
            email: newUser.email,
            role: newUser.role,
        };
        const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });

        // Prepare the HTML email content
        const userHtmlTable = `
            <table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse;">
                <thead>
                    <tr><th colspan="2">Registration Details</th></tr>
                </thead>
                <tbody>
                    <tr><td>Username:</td><td>${username}</td></tr>
                    <tr><td>Email:</td><td>${email}</td></tr>
                    <tr><td>Full Name:</td><td>${fullName}</td></tr>
                    <tr><td>Role:</td><td>${role}</td></tr>
                </tbody>
            </table>`;

        await sendEmail(
            email,
            'Registration Details',
            `Hello ${fullName},<br><br>You have successfully registered with the following details:<br>${userHtmlTable}<br>Please wait for login until the admin approves you.`
        );

        return res.json({
            success: 'User registered successfully',
            user: newUser,
            token: token,
        });
    } catch (err) {
        console.error('Error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists with the provided email and password
        const select = "SELECT * FROM sahil.users WHERE email=$1 AND password=$2";
        const { rows } = await db.query(select, [email, password]);

        if (rows.length > 0) {
            const user = rows[0];

            // Check if the user is approved
            if (user.approved === false) {
                return res.status(403).json({ error: 'Your account is not approved by the admin. Please wait for approval.' });
            }

            // Create a JWT payload with user's role
            const payload = {
                id: user.id,
                email: user.email,
                role: user.role,
            };

            // Sign the token with the secret key
            const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });

            return res.status(200).json({
                message: "Successful Login",
                user: user,
                token: token,
            });
        } else {
            return res.status(404).json({ error: 'Invalid email or password' });
        }
    } catch (err) {
        console.error({ err: "Database error" });
        return res.status(500).json('Database error');
    }
};

module.exports = { signup, login, sendOtp, resetPassword,    getProfile, };
