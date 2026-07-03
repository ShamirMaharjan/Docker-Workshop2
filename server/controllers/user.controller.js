const User = require('../models/user.model');
const Task = require('../models/task.model');
const OTP = require('../models/otp.model');
const sendEmail = require('../utils/sendEmail');
const bcrypt = require('bcrypt');

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');

        //calculate the streak based on the tasks completed in the last 7 days
        const clearedTasks = await Task.find({
            userId: req.user._id,
            status: 'cleared',
        }).sort({ updatedAt: -1 });

        //extract unique dates the use cleared tasks
        const uniqueDates = [...new Set(clearedTasks.map(t =>
            new Date(t.updatedAt).setHours(0, 0, 0, 0)
        ))].sort((a, b) => b - a);
        
        let streak = 0;
        const today = new Date().setHours(0, 0, 0, 0);
        const yesterday = today - 86400000; // 24 hours in milliseconds

        if (uniqueDares.length > 0) {
            // check if user have cleared task today or yeasterday to keep the streak alive
            if (uniqueDates[0] === today || uniqueDates[0] === yesterday) {
                streak = 1;
                let currentDateToCheck = uniqueDates[0];

                // loop backward day by day to count consecutive days
                for (let i = 1; i < uniqueDates.length; i++) {
                    const expectedPreviousDay = currentDateToCheck - 86400000;
                    if (uniqueDates[i] === expectedPreviousDay) {
                        streak++;
                        currentDateToCheck = expectedPreviousDay;
                    } else {
                        break;
                    }
                }
            }
        }
        
        res.status(200).json({ user, streak, totalCleared: clearedTasks.length });
    } catch (error) {
        res.status(500).json({ message: "Error loading profile data." });
    }
};

const updateName = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ message: "Name is required" });

        const updateUser = await User.findByIdAndUpdate(
            req.user._id,
            { name },
            { new: true }
        ).select('-password');

        res.status(200).json(updateUser);
    } catch (error) {
        res.status(500).json({ message: "Error updating name." });
    }
};

const requestSecurityOTP = async (req, res) => {
    try {
        // delete any existing OTPs for this user to prevent spam
        await OTP.deleteMany({ userId: req.user._id });

        const otpCode = generateOTP();
        await OTP.createIndexes({ userId: req.user._id, otp: otpCode });

        const emailSent = await sendEmail(
            req.user.email,
            "Your Security Verification Code",
            `Your 6-digit verification code is: ${otpCode}\n\nThis code will expire in 5 minutes.`
        );

        if (!emailSent) {
            return res.status(500).json({ message: "Failed to send email." });
        }

        res.status(200).json({ message: "OTP sent to your email." });
    } catch (error) {
        res.status(500).json({ message: "Error generating OTP." });
    }
};

const updateEmailWithOTP = async (req, res) => {
    try {
        const { otp, newEmail } = req.body;

        const validOtp = await OTP.findOne({ userId: req.user._id, otp });
        if (!validOtp) {
            return res.status(400).json({ message: "Invalid or expired OTP." });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { email: newEmail },
            { new: true }
        ).select('-password');

        // delete the used otp
        await OTP.deleteOne({ _id: validOtp._id });

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: "Error updating email." });
    }
};

const updatePasswordWithOTP = async (req, res) => {
    try {
        const { otp, newPassword } = req.body;

        const validOtp = await OTP.findOne({ userId: req.user._id, otp });
        if (!validOtp) {
            return res.status(400).json({ message: "Invalid or expired OTP." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await User.findByIdAndUpdate(req.user._id, { password: hashedPassword });

        await OTP.deleteOne({ _id: validOtp._id });

        res.status(200).json({ message: "Password updated successfully." });
    } catch (error) {
        res.status(500).json({ message: "Error updating password." });
    }
};

module.exports = {
    getUserProfile,
    updateName,
    requestSecurityOTP,
    updateEmailWithOTP,
    updatePasswordWithOTP,
};