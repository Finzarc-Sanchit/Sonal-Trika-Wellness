const Contact = require('../models/contactModel');
const Retreat = require('../models/retreatModel');
const logger = require('../config/logger');
const config = require('../config/config');

const devError = (error) =>
    config.node_env === 'development' ? error.message : 'Something went wrong';

const OVERVIEW_RANGES = ['3_months', '6_months', 'ytd', 'all_time'];
const DEFAULT_RANGE = '6_months';

const subtractMonths = (date, months) => {
    const result = new Date(date);
    result.setMonth(result.getMonth() - months);
    return result;
};

const resolveCutoffDate = (range) => {
    const now = new Date();

    switch (range) {
        case '3_months':
            return subtractMonths(now, 3);
        case '6_months':
            return subtractMonths(now, 6);
        case 'ytd':
            return new Date(now.getFullYear(), 0, 1);
        case 'all_time':
            return null;
        default:
            return subtractMonths(now, 6);
    }
};

const buildPipeline = (groupField, cutoffDate) => {
    const pipeline = [];

    if (cutoffDate) {
        pipeline.push({ $match: { createdAt: { $gte: cutoffDate } } });
    }

    pipeline.push(
        { $group: { _id: `$${groupField}`, count: { $sum: 1 } } },
        { $sort: { count: -1 } },
    );

    return pipeline;
};

// GET /api/v1/admin/overview-stats?range=6_months
const getOverviewStats = async (req, res) => {
    try {
        const range = OVERVIEW_RANGES.includes(req.query.range)
            ? req.query.range
            : DEFAULT_RANGE;
        const cutoffDate = resolveCutoffDate(range);

        const [serviceBreakdown, retreatBreakdown] = await Promise.all([
            Contact.aggregate(buildPipeline('service', cutoffDate)),
            Retreat.aggregate(buildPipeline('location', cutoffDate)),
        ]);

        const servicesData = serviceBreakdown.map((row) => ({
            service: row._id ?? 'unknown',
            count: row.count,
        }));

        const retreatsData = retreatBreakdown.map((row) => ({
            location: row._id ?? 'unknown',
            count: row.count,
        }));

        logger.info(`Admin overview stats retrieved (range: ${range})`);

        res.status(200).json({
            success: true,
            message: 'Overview statistics retrieved successfully',
            data: {
                range,
                servicesData,
                retreatsData,
            },
        });
    } catch (error) {
        logger.error('Error retrieving admin overview stats:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: devError(error),
        });
    }
};

module.exports = {
    getOverviewStats,
};
