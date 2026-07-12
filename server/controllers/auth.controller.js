const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const generateToken = require('../utils/generateToken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const OTP = require('../models/otp.model');
const sendEmail = require('../utils/sendEmail');

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// register a new user
const registerUser = async (req, res) => {
    try {
        const { name, email, password, turnstileToken } = req.body;

        if (!turnstileToken) return res.status(400).json({ message: "Security verification failed." });
        const isCaptchValid = await verifyTurnstile(turnstileToken);
        if (!isCaptchValid) return res.status(400).json({ message: "Security verification failed." });

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "EMail already in use. " });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        if (user) {
            generateToken(res, user._id);
            res.status(201).json({
                message: "Account created successfully",
                user: { id: user._id, name: user.name, email: user.email }
            });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error during registration. ", error })
    }
};

// login a user
const loginUser = async (req, res) => {
    try {
        const { email, password, turnstileToken } = req.body;

        if (!turnstileToken) return res.status(400).json({ message: "Security verification failed." });
        const isCaptchValid = await verifyTurnstile(turnstileToken);
        if (!isCaptchValid) return res.status(400).json({ message: "Security verification failed." });
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found. " });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials. " });
        }

        generateToken(res, user._id);

        res.status(200).json({
            message: "Logged in successfully",
            user: { id: user._id, name: user.name, email: user.email }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error during login. ", error });
    }
};

// google login
const googleLogin = async (req, res) => {
    try {
        const { credential } = req.body;

        //verify the token with google
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();
        const { email, name, sub: googleId } = payload;

        let user = await User.findOne({ email });

        if (user) {
            // if user exists and not with googleId, linked it
            if (!user.googleId) {
                user.googleId = googleId;
                await user.save();
            }
        } else {
            user = await User.create({
                name,
                email,
                googleId,
            });
        }

        generateToken(res, user._id);

        res.status(200).json({
            message: "Google login successful",
            user: { id: user._id, name: user.name, email: user.email }
        });
    } catch (error) {
        console.error("google auth error", error);
        res.status(401).json({ message: "Google authentication failed." });
    }
};

// verify turnstile
const verifyTurnstile = async (token) => {
    try {
        const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            body: new URLSearchParams({
                secret: process.env.TURNSTILE_SECRET_KEY,
                response: token
            })
        });
        const data = await response.json();
        return data.success;
    } catch (error) {
        console.error("{turnstile verification error", error);
        return false;
    }
};

// forgot password
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email })

        //snet otp wihtout revleaing if the email exists or not
        if (!user) {
            return res.status(200).json({ message: "If that email exists, an OTP has been sent. " });
        }

        await OTP.deleteMany({ userId: user._id });

        const otpCode = generateOTP();
        await OTP.create({ userId: user._id, otp: otpCode });

        const emailSent = await sendEmail(
            user.email,
            "ToDo - Password Reset Code",
            `Your password reset code is: ${otpCode}\n\nThis code will expire in 5 minutes.`
        );

        if (!emailSent) {
            return res.status(500).json({ message: "Failed to send email." });
        }

        res.status(200).json({ message: "OTP sent successfully." });
    } catch (error) {
        console.error("error during password reset request:", error);
        res.status(500).json({ message: "Server error during password reset request. Please try again later." });
    }
};

// reset password
const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid request." });

        const validOtp = await OTP.findOne({ userId: user._id, otp });
        if (!validOtp) {
            return res.status(400).json({ message: "Invalid or expired OTP." });
        }

        //hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        //update user and delete the used otp
        await User.findByIdAndUpdate(user._id, { password: hashedPassword });
        await OTP.deleteOne({ _id: validOtp._id });

        res.status(200).json({ message: "Password reset successful. You can now log in." });
    } catch (error) {
        console.error("error during password reset:", error);
        res.status(500).json({ message: "Server error during password reset." });
    }
};

module.exports = { registerUser, loginUser, googleLogin, forgotPassword, resetPassword };