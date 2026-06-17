const express = require('express');
const {
    createContact,
    getContacts,
    getContactById,
    updateContact,
    deleteContact,
    getContactStats,
} = require('../controllers/contactController');
const { authenticate } = require('../middlewares/authMiddleware');
const { validateContact } = require('../middlewares/contactValidation.middleware');
const { sanitizeContact } = require('../middlewares/contactSanitize.middleware');
const { rateLimit } = require('../middlewares/rateLimitMiddleware');

const router = express.Router();

// POST /api/v1/contacts - Create new contact (public)
router.post('/', rateLimit, sanitizeContact, validateContact, createContact);

// GET /api/v1/contacts - List contacts (admin)
router.get('/', authenticate, getContacts);

// GET /api/v1/contacts/stats - Contact statistics (admin)
router.get('/stats', authenticate, getContactStats);

// GET /api/v1/contacts/:id - Get contact by ID (admin)
router.get('/:id', authenticate, getContactById);

// PUT /api/v1/contacts/:id - Update contact (admin)
router.put('/:id', authenticate, updateContact);

// DELETE /api/v1/contacts/:id - Delete contact (admin)
router.delete('/:id', authenticate, deleteContact);

module.exports = router;
