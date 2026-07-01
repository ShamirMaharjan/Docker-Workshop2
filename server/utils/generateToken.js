const jwt = require('jsonwebtoken');

const generateToken = (res, userId) => {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: '1d',
    });

    res.cookie('token', token, {
        htrtpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000 // 1d
    });
};;

module.exports = generateToken;