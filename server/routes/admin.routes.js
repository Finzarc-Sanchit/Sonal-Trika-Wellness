const express = require('express');
const { getOverviewStats } = require('../controllers/adminController');
const { authenticate } = require('../middlewares/authMiddleware');

const router = express.Router();

// GET /api/v1/admin/overview-stats
router.get('/overview-stats', authenticate, getOverviewStats);

module.exports = router;
