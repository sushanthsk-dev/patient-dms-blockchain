

const express = require('express');
const router = express.Router();
const { authMiddleware, roleCheck } = require('../middleware/auth');
const medicalRecordController = require('../controllers/medicalRecordController');
const { protect } = require('../controllers/authController');

router.post('/add', protect, medicalRecordController.addMedicalRecord);

module.exports = router;
