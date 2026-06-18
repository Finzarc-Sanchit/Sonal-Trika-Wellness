const express = require('express');
const {
    createRetreatInquiry,
    getRetreats,
    getRetreatStats,
    updateRetreat,
    deleteRetreat,
} = require('../controllers/retreatController');
const { authenticate } = require('../middlewares/authMiddleware');
const { validate, schemas } = require('../middlewares/validate');
const { rateLimit } = require('../middlewares/rateLimitMiddleware');

const router = express.Router();

// POST /api/v1/retreats - Submit retreat inquiry (public)
router.post('/', rateLimit, validate(schemas.retreat), createRetreatInquiry);

// GET /api/v1/retreats - List retreats (admin)
router.get('/', authenticate, getRetreats);

// GET /api/v1/retreats/stats - Retreat statistics (admin)
router.get('/stats', authenticate, getRetreatStats);

// PATCH /api/v1/retreats/:id - Update retreat (admin)
router.patch('/:id', authenticate, updateRetreat);

// DELETE /api/v1/retreats/:id - Delete retreat (admin)
router.delete('/:id', authenticate, deleteRetreat);

module.exports = router;
