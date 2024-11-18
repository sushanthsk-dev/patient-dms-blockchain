const express = require('express');
const router = express.Router();
const { authMiddleware, roleCheck } = require('../middleware/auth');
const doctorController = require('../controllers/doctorController');
const { protect } = require('../controllers/authController');

router.post('/register', protect, doctorController.register);
router.post('/verify-doctor', protect, doctorController.verifyDoctor);
router.post('/authorize-doctor', protect, doctorController.authorizeDoctor);


router.get('/verified/all', protect, doctorController.getVerifiedDoctors);
router.get('/all', protect, doctorController.getDoctors);

router.get('/records/:address', protect, doctorController.getPatientsRecords);

module.exports = router;
