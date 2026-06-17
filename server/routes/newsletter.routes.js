const express = require('express');
const {
    subscribeNewsletter,
    unsubscribeNewsletter,
    sendNewsletterCampaign,
    getNewsletterSubscribers,
    deleteNewsletterSubscriber,
} = require('../controllers/newsletterController');
const { authenticate } = require('../middlewares/authMiddleware');
const {
    validateNewsletter,
    validateNewsletterCampaign,
} = require('../middlewares/newsletterValidation.middleware');
const { sanitizeNewsletter } = require('../middlewares/newsletterSanitize.middleware');
const { rateLimit } = require('../middlewares/rateLimitMiddleware');

const router = express.Router();

// POST /api/v1/newsletter - Subscribe (public)
router.post('/', rateLimit, sanitizeNewsletter, validateNewsletter, subscribeNewsletter);

// POST /api/v1/newsletter/unsubscribe - Unsubscribe (public)
router.post(
    '/unsubscribe',
    rateLimit,
    sanitizeNewsletter,
    validateNewsletter,
    unsubscribeNewsletter,
);

// POST /api/v1/newsletter/send - Broadcast campaign (admin)
router.post('/send', authenticate, validateNewsletterCampaign, sendNewsletterCampaign);

// GET /api/v1/newsletter - List subscribers (admin)
router.get('/', authenticate, getNewsletterSubscribers);

// DELETE /api/v1/newsletter/:id - Remove subscriber (admin)
router.delete('/:id', authenticate, deleteNewsletterSubscriber);

module.exports = router;
