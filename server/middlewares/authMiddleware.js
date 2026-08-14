const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const protect = async (req, res, next) => {
    let token = req.cookies.token;

    if (token) {  // Check if token exists in cookies
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            res.status(401).json({ message: "Not authorized, token failed. " });
        }
    } else {
        res.status(401).json({ message: "Not authorized, no token. " });
    }
};

module.exports = { protect };