const express = require('express');
const router = express.Router();
const { authMiddleware, roleCheck } = require('../middleware/auth');
const patientController = require('../controllers/patientController');
const { login, signup, getMe } = require('../controllers/authController');

router.post('/login', login);

router.post('/signup', signup);
router.get('/me', getMe);

module.exports = router;
