const Retreat = require('../models/retreatModel');
const logger = require('../config/logger');
const mailer = require('../config/mailer');
const config = require('../config/config');

const devError = (error) =>
    config.node_env === 'development' ? error.message : 'Something went wrong';

const RETREAT_STATUSES = [
    'inquiry',
    'waitlisted',
    'deposit_pending',
    'confirmed',
    'cancelled',
];

const RETREAT_LOCATIONS = ['rishikesh', 'jaisalmer', 'sri-lanka', 'gangtok'];

const handleValidationError = (res, error) => {
    const errors = Object.values(error.errors).map((err) => err.message);
    return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors,
    });
};

// POST /api/v1/retreats - Create retreat inquiry (public)
const createRetreatInquiry = async (req, res) => {
    try {
        const { name, phone, email, location, details } = req.body;

        const retreat = new Retreat({
            name,
            phone,
            email,
            location,
            details,
        });

        await retreat.save();

        try {
            await mailer.sendConfirmationEmail({
                to: email,
                name,
            });
            logger.info(`Retreat confirmation email sent to: ${email}`);
        } catch (emailError) {
            logger.error(
                `Failed to send retreat confirmation email to ${email}:`,
                emailError,
            );
        }

        try {
            await mailer.sendRetreatAdminNotification({ retreat });
            logger.info(`Admin notification sent for retreat inquiry: ${retreat._id}`);
        } catch (emailError) {
            logger.error(
                `Failed to send admin notification for retreat ${retreat._id}:`,
                emailError,
            );
        }

        logger.info(`New retreat inquiry created: ${retreat._id} - ${retreat.name}`);

        res.status(201).json({
            success: true,
            message: 'Thank you for your retreat inquiry. We will be in touch shortly.',
            data: retreat,
        });
    } catch (error) {
        logger.error('Error creating retreat inquiry:', error);

        if (error.name === 'ValidationError') {
            return handleValidationError(res, error);
        }

        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: devError(error),
        });
    }
};

// GET /api/v1/retreats - List all retreats (admin)
const getRetreats = async (req, res) => {
    try {
        const retreats = await Retreat.find().sort({ createdAt: -1 });

        logger.info(`Retrieved ${retreats.length} retreat records`);

        res.status(200).json({
            success: true,
            message: 'Retreats retrieved successfully',
            data: {
                retreats,
                total: retreats.length,
            },
        });
    } catch (error) {
        logger.error('Error retrieving retreats:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: devError(error),
        });
    }
};

// GET /api/v1/retreats/stats - Retreat statistics (admin)
const getRetreatStats = async (req, res) => {
    try {
        const [facetResult] = await Retreat.aggregate([
            {
                $facet: {
                    statusBreakdown: [
                        {
                            $group: {
                                _id: '$status',
                                count: { $sum: 1 },
                            },
                        },
                        { $sort: { _id: 1 } },
                    ],
                    locationBreakdown: [
                        {
                            $group: {
                                _id: '$location',
                                count: { $sum: 1 },
                            },
                        },
                        { $sort: { _id: 1 } },
                    ],
                    totals: [{ $count: 'total' }],
                },
            },
        ]);

        const statusCounts = RETREAT_STATUSES.reduce((acc, status) => {
            acc[status] = 0;
            return acc;
        }, {});

        (facetResult?.statusBreakdown ?? []).forEach((row) => {
            if (row._id) statusCounts[row._id] = row.count;
        });

        const locationCounts = RETREAT_LOCATIONS.reduce((acc, location) => {
            acc[location] = 0;
            return acc;
        }, {});

        (facetResult?.locationBreakdown ?? []).forEach((row) => {
            if (row._id) locationCounts[row._id] = row.count;
        });

        const totalRetreats = facetResult?.totals?.[0]?.total ?? 0;

        res.status(200).json({
            success: true,
            message: 'Retreat statistics retrieved successfully',
            data: {
                overview: {
                    totalRetreats,
                    ...statusCounts,
                },
                locations: locationCounts,
            },
        });
    } catch (error) {
        logger.error('Error retrieving retreat statistics:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: devError(error),
        });
    }
};

// PATCH /api/v1/retreats/:id - Update retreat (admin)
const updateRetreat = async (req, res) => {
    try {
        const { status, location } = req.body;

        const retreat = await Retreat.findById(req.params.id);
        if (!retreat) {
            return res.status(404).json({
                success: false,
                message: 'Retreat not found',
            });
        }

        if (status !== undefined) {
            if (!RETREAT_STATUSES.includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid status value',
                    errors: [`Status must be one of: ${RETREAT_STATUSES.join(', ')}`],
                });
            }
            retreat.status = status;
        }

        if (location !== undefined) {
            if (!RETREAT_LOCATIONS.includes(location)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid location value',
                    errors: [`Location must be one of: ${RETREAT_LOCATIONS.join(', ')}`],
                });
            }
            retreat.location = location;
        }

        await retreat.save();

        logger.info(`Retreat updated: ${retreat._id}`);

        res.status(200).json({
            success: true,
            message: 'Retreat updated successfully',
            data: retreat,
        });
    } catch (error) {
        logger.error('Error updating retreat:', error);

        if (error.name === 'ValidationError') {
            return handleValidationError(res, error);
        }

        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: devError(error),
        });
    }
};

// DELETE /api/v1/retreats/:id - Remove retreat (admin)
const deleteRetreat = async (req, res) => {
    try {
        const retreat = await Retreat.findByIdAndDelete(req.params.id);

        if (!retreat) {
            return res.status(404).json({
                success: false,
                message: 'Retreat not found',
            });
        }

        logger.info(`Retreat deleted: ${retreat._id}`);

        res.status(200).json({
            success: true,
            message: 'Retreat deleted successfully',
        });
    } catch (error) {
        logger.error('Error deleting retreat:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: devError(error),
        });
    }
};

module.exports = {
    createRetreatInquiry,
    getRetreats,
    getRetreatStats,
    updateRetreat,
    deleteRetreat,
};
