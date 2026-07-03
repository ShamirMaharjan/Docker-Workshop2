const express = require('express');
const router = express.Router();
const {
    getUserProfile,
    updateName,
    requestSecurityOTP,
    updateEmailWithOTP,
    updatePasswordWithOTP
} = require('../controllers/user.controller');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.get('/profile', getUserProfile);
router.put('/profile/name', updateName);
router.post('/profile/request-otp', requestSecurityOTP);
router.put('/profile/email', updateEmailWithOTP);
router.put('/profile/password', updatePasswordWithOTP);

module.exports = router;