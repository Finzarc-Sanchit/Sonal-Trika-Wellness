const express = require('express');
const authRoutes = require('./auth.routes');
const contactRoutes = require('./contact.routes');
const newsletterRoutes = require('./newsletter.routes');
const retreatRoutes = require('./retreat.routes');
const adminRoutes = require('./admin.routes');
const router = express.Router();

router.use('/auth', authRoutes);
router.use('/contacts', contactRoutes);
router.use('/newsletter', newsletterRoutes);
router.use('/retreats', retreatRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
