const express = require('express');
const { login, me } = require('../controllers/authController');
const { authenticate } = require('../middlewares/authMiddleware');
const { validate, schemas } = require('../middlewares/validate');
const { rateLimit } = require('../middlewares/rateLimitMiddleware');

const router = express.Router();

// POST /api/v1/auth/login
router.post('/login', rateLimit, validate(schemas.login), login);

// GET /api/v1/auth/me
router.get('/me', authenticate, me);

module.exports = router;
