const express = require('express');
const { login, me } = require('../controllers/authController');
const { authenticate } = require('../middlewares/authMiddleware');
const { validateLogin } = require('../middlewares/authValidationMiddleware');
const { rateLimit } = require('../middlewares/rateLimitMiddleware');

const router = express.Router();

// POST /api/v1/auth/login
router.post('/login', rateLimit, validateLogin, login);

// GET /api/v1/auth/me
router.get('/me', authenticate, me);

module.exports = router;
