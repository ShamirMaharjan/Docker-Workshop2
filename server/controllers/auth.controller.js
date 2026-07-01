const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const generateToken = require('../utils/generateToken');

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

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