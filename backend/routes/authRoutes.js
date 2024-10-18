const express = require('express');
const multer = require('multer');
const { signup, login, sendOtp, resetPassword, getProfile } = require('../controllers/authController');

const router = express.Router();
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

router.post('/signup', upload.single('image'), signup);
router.post('/login', login);
router.post('/otp', sendOtp);
router.post('/reset-password', resetPassword);
router.post('/profile', getProfile);

module.exports = router;
