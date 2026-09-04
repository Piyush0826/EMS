import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

// Create transporter function (lazy initialization)
const getTransporter = () => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        throw new Error('EMAIL_USER and EMAIL_PASS must be configured in server/.env');
    }

    return nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS.replace(/\s/g, '')
        }
    });
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid email" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Wrong Password" });
        }

        const token = jwt.sign(
            { _id: user._id, role: user.role }, 
            process.env.JWT_KEY, 
            { expiresIn: '10d' }
        );

        return res.status(200).json({ 
            success: true, 
            token, 
            user: { 
                _id: user._id, 
                name: user.name, 
                role: user.role 
            } 
        });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

const verify = async (req, res) => {
    return res.status(200).json({ success: true, user: req.user });
};

const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const userId = req.user._id;

        // Validation
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ success: false, error: "All fields are required" });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ success: false, error: "Password must be at least 6 characters" });
        }

        // Get user from database
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" });
        }

        // Compare old password
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, error: "Old password is incorrect" });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update user password
        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({ success: true, message: "Password changed successfully" });
    } catch (error) {
        console.error('Error changing password:', error);
        return res.status(500).json({ success: false, error: "Server error while changing password" });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const email = req.body.email?.trim().toLowerCase();

        if (!email) {
            return res.status(400).json({ success: false, error: "Email is required" });
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, error: "No account found with this email" });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

        // Create reset link
        const frontendBaseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const resetLink = `${frontendBaseUrl}/reset-password/${resetToken}`;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset Request - Employee Management System',
            html: `
                <div style="font-family: poppins, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #0891b2;">Password Reset Request</h2>
                    <p>Hello ${user.name},</p>
                    <p>We received a request to reset your password. Click the link below to proceed:</p>
                    <p>
                        <a href="${resetLink}" style="background-color: #0891b2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                            Reset Password
                        </a>
                    </p>
                    <p style="color: #666;">This link will expire in 15 minutes.</p>
                    <p style="color: #666;">If you didn't request this, please ignore this email.</p>
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                    <p style="color: #999; font-size: 12px;">Employee Management System</p>
                </div>
            `
        };

        const transporter = getTransporter();
        await transporter.sendMail(mailOptions);

        // Store the token only after the email provider accepts the message.
        user.resetToken = resetToken;
        user.resetTokenExpiry = resetTokenExpiry;
        await user.save();

        return res.status(200).json({ 
            success: true, 
            message: "Password reset link has been sent to your email" 
        });

    } catch (error) {
        console.error('Error in forgot password:', error.message);
        console.error('Full error:', error);
        return res.status(500).json({ success: false, error: "Failed to send reset email" });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({ success: false, error: "Token and password are required" });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ success: false, error: "Password must be at least 6 characters" });
        }

        // Find user with valid reset token
        const user = await User.findOne({
            resetToken: token,
            resetTokenExpiry: { $gt: new Date() }
        });

        if (!user) {
            return res.status(400).json({ success: false, error: "Invalid or expired reset link" });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password and clear reset token
        user.password = hashedPassword;
        user.resetToken = null;
        user.resetTokenExpiry = null;
        await user.save();

        return res.status(200).json({ 
            success: true, 
            message: "Password has been reset successfully. Please login with your new password." 
        });

    } catch (error) {
        console.error('Error resetting password:', error);
        return res.status(500).json({ success: false, error: "Server error while resetting password" });
    }
};

export { login, verify, changePassword, forgotPassword, resetPassword };