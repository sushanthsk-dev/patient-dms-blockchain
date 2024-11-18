const express = require('express');
const router = express.Router();
const { authMiddleware, roleCheck } = require('../middleware/auth');
const patientController = require('../controllers/patientController');
const { protect } = require('../controllers/authController');


router.post('/register', protect, patientController.register);
router.get('/all', protect, patientController.getAllPatients);

router.get('/:address/records', protect, patientController.getRecord);

module.exports = router;
