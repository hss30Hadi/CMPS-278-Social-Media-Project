require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');
const mysql = require('mysql2');
const crypto = require('crypto'); // For generating reset tokens
const bcrypt = require('bcrypt');

const app = express();
const PORT = 3000;
const saltRounds = 10; // Number of rounds for password hashing

// Middleware to parse JSON
app.use(bodyParser.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'myappdb'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database.');
});

// Nodemailer setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Default route to handle root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Sign-Up Route
app.post('/signup', (req, res) => {
    const { email, username, password } = req.body;
    const verificationCode = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit code

    // Hash the password
    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
        if (err) return res.status(500).send('Error hashing password.');

        // Store user details and verification code (in a real app, use a database)
        db.query(
            'INSERT INTO users (username, email, password, verification_code) VALUES (?, ?, ?, ?)',
            [username, email, password, verificationCode],
            (err, result) => {
                if (err) {
                    return res.status(500).send('Error saving user to the database.');
                }

                // Send verification email
                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: email,
                    subject: 'Your Verification Code',
                    text: `Hello ${username},\n\nYour verification code is: ${verificationCode}\n\nThank you!`,
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        return res.status(500).send('Error sending email.');
                    }
                    res.status(200).send('Verification email sent.');
                });
            }
        );
    });
});

// Verification Route
app.post('/verify', (req, res) => {
    const { email, code } = req.body;
    db.query('SELECT * FROM users WHERE email = ? AND verification_code = ?', [email, code], (err, results) => {
        if (err || results.length === 0) {
            return res.status(400).send('Invalid verification code.');
        }
        res.status(200).send('Verification successful.');
    });
});

// Forgot Password Route
app.post('/forgot-password', (req, res) => {
    const { email } = req.body;

    // Check if the user exists in the database
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) {
            return res.status(500).send('Error checking user in the database.');
        }

        if (results.length === 0) {
            return res.status(404).send('No account found with that email.');
        }

        // Generate a password reset token and expiration time
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = Date.now() + 3600000; // Token expires in 1 hour

        // Save the reset token and expiry to the database
        db.query(
            'UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE email = ?',
            [resetToken, resetTokenExpiry, email],
            (err, result) => {
                if (err) {
                    return res.status(500).send('Error saving reset token.');
                }

                // Send the reset password email
                const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;
                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: email,
                    subject: 'Password Reset Request',
                    text: `You requested a password reset. Click the link to reset your password: ${resetLink}`,
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        return res.status(500).send('Error sending email.');
                    }
                    res.status(200).send('Password reset link sent to your email.');
                });
            }
        );
    });
});

// Reset Password Route
app.post('/reset-password', (req, res) => {
    const { token, newPassword } = req.body;

    // Check if the token is valid
    db.query('SELECT * FROM users WHERE reset_token = ? AND reset_token_expiry > ?', [token, Date.now()], async (err, results) => {
        if (err || results.length === 0) {
            return res.status(400).send('Invalid or expired reset token.');
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        // Update the password and remove the reset token
        db.query('UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE reset_token = ?', [hashedPassword, token], (err, result) => {
            if (err) {
                return res.status(500).send('Error updating password.');
            }
            res.status(200).send('Password has been reset successfully.');
        });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
