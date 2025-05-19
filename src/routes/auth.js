const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Register route
router.post('/register', authController.signup);  // Note: changed to signup to match controller
// Login route
router.post('/login', authController.login);

module.exports = router;