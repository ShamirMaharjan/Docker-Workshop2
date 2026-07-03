const express = require('express');
const router = express.Router();
const { registerUser, loginUser, googleLogin, verifyTurnstile } = require('../controllers/auth.controller');
const { authLimiter } = require('../middlewares/rateLimiter');

router.post('/register', authLimiter, registerUser);
router.post('/login', authLimiter, loginUser);
router.post('/google', authLimiter, googleLogin);

module.exports = router;