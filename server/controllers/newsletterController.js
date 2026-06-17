const Newsletter = require('../models/newsletterModel');
const logger = require('../config/logger');
const config = require('../config/config');
const mailer = require('../config/mailer');

const devError = (error) =>
    config.node_env === 'development' ? error.message : 'Something went wrong';

// POST /api/v1/newsletter - Subscribe (public)
const subscribeNewsletter = async (req, res) => {
    try {
        const { email } = req.body;

        const existing = await Newsletter.findOne({ email });
        if (existing) {
            if (existing.status === 'unsubscribed') {
                existing.status = 'active';
                await existing.save();
                logger.info(`Newsletter resubscribed: ${existing._id} - ${email}`);
                return res.status(200).json({
                    success: true,
                    message: 'Welcome back! You have been resubscribed to our newsletter.',
                    data: existing,
                });
            }

            return res.status(409).json({
                success: false,
                message: 'This email is already subscribed to our newsletter.',
            });
        }

        const subscriber = await Newsletter.create({ email });

        logger.info(`Newsletter subscription created: ${subscriber._id} - ${email}`);

        res.status(201).json({
            success: true,
            message: 'Thank you for subscribing to our newsletter.',
            data: subscriber,
        });
    } catch (error) {
        logger.error('Error subscribing to newsletter:', error);

        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: 'This email is already subscribed to our newsletter.',
            });
        }

        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map((err) => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors,
            });
        }

        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: devError(error),
        });
    }
};

// GET /api/v1/newsletter - List subscribers (admin)
const getNewsletterSubscribers = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const skip = (page - 1) * limit;

        const filter = {};
        if (req.query.status) {
            filter.status = req.query.status;
        }

        const subscribers = await Newsletter.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Newsletter.countDocuments(filter);
        const totalPages = Math.ceil(total / limit);

        res.status(200).json({
            success: true,
            message: 'Newsletter subscribers retrieved successfully',
            data: {
                subscribers,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalSubscribers: total,
                    hasNext: page < totalPages,
                    hasPrev: page > 1,
                },
            },
        });
    } catch (error) {
        logger.error('Error retrieving newsletter subscribers:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: devError(error),
        });
    }
};

// POST /api/v1/newsletter/unsubscribe - Unsubscribe (public)
const unsubscribeNewsletter = async (req, res) => {
    try {
        const { email } = req.body;
        const subscriber = await Newsletter.findOne({ email });

        if (!subscriber) {
            return res.status(404).json({ success: false, message: 'Email address not found.' });
        }

        subscriber.status = 'unsubscribed';
        await subscriber.save();

        logger.info(`Newsletter unsubscribed: ${subscriber._id} - ${email}`);
        res.status(200).json({ success: true, message: 'You have successfully unsubscribed.' });
    } catch (error) {
        logger.error('Error unsubscribing:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// POST /api/v1/newsletter/send - Broadcast campaign to active subscribers (admin)
const sendNewsletterCampaign = async (req, res) => {
    try {
        const subject = req.body.subject.trim();
        const content = req.body.content.trim();

        const activeSubscribers = await Newsletter.find({ status: 'active' });

        if (activeSubscribers.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'No active subscribers to send to.',
                data: { sent: 0, failed: 0, total: 0 },
            });
        }

        const results = await Promise.allSettled(
            activeSubscribers.map((subscriber) =>
                mailer.sendNewsletterCampaign({
                    to: subscriber.email,
                    subject,
                    content,
                }),
            ),
        );

        const sent = results.filter((result) => result.status === 'fulfilled').length;
        const failed = results.length - sent;

        results.forEach((result, index) => {
            if (result.status === 'rejected') {
                logger.error(
                    `Newsletter campaign failed for ${activeSubscribers[index].email}:`,
                    result.reason,
                );
            }
        });

        logger.info(`Newsletter campaign "${subject}" sent to ${sent}/${activeSubscribers.length} subscribers`);

        res.status(200).json({
            success: true,
            message: `Campaign sent to ${sent} of ${activeSubscribers.length} active subscribers.`,
            data: {
                sent,
                failed,
                total: activeSubscribers.length,
            },
        });
    } catch (error) {
        logger.error('Error sending newsletter campaign:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: devError(error),
        });
    }
};

// DELETE /api/v1/newsletter/:id - Remove subscriber (admin)
const deleteNewsletterSubscriber = async (req, res) => {
    try {
        const subscriber = await Newsletter.findByIdAndDelete(req.params.id);

        if (!subscriber) {
            return res.status(404).json({
                success: false,
                message: 'Subscriber not found',
            });
        }

        logger.info(`Newsletter subscriber deleted: ${subscriber._id}`);

        res.status(200).json({
            success: true,
            message: 'Subscriber removed successfully',
        });
    } catch (error) {
        logger.error('Error deleting newsletter subscriber:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: devError(error),
        });
    }
};

module.exports = {
    subscribeNewsletter,
    unsubscribeNewsletter,
    sendNewsletterCampaign,
    getNewsletterSubscribers,
    deleteNewsletterSubscriber,
};
