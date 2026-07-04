const express = require('express');
const router = express.Router();
const { registerUser, loginUser, googleLogin, forgotPassword, resetPassword } = require('../controllers/auth.controller');
const { authLimiter } = require('../middlewares/rateLimiter');

router.post('/register', authLimiter, registerUser);
router.post('/login', authLimiter, loginUser);
router.post('/google', authLimiter, googleLogin);
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/reset-password', authLimiter, resetPassword);

module.exports = router;