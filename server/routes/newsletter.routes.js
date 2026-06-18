const express = require('express');
const {
    subscribeNewsletter,
    unsubscribeNewsletter,
    sendNewsletterCampaign,
    getNewsletterSubscribers,
    deleteNewsletterSubscriber,
} = require('../controllers/newsletterController');
const { authenticate } = require('../middlewares/authMiddleware');
const { validate, schemas } = require('../middlewares/validate');
const { rateLimit } = require('../middlewares/rateLimitMiddleware');

const router = express.Router();

// POST /api/v1/newsletter - Subscribe (public)
router.post('/', rateLimit, validate(schemas.newsletter), subscribeNewsletter);

// POST /api/v1/newsletter/unsubscribe - Unsubscribe (public)
router.post(
    '/unsubscribe',
    rateLimit,
    validate(schemas.newsletter),
    unsubscribeNewsletter,
);

// POST /api/v1/newsletter/send - Broadcast campaign (admin)
router.post('/send', authenticate, validate(schemas.newsletterCampaign), sendNewsletterCampaign);

// GET /api/v1/newsletter - List subscribers (admin)
router.get('/', authenticate, getNewsletterSubscribers);

// DELETE /api/v1/newsletter/:id - Remove subscriber (admin)
router.delete('/:id', authenticate, deleteNewsletterSubscriber);

module.exports = router;
