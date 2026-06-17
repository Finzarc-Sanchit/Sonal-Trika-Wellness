const config = require('../config/config');
const logger = require('../config/logger');
const { verifyToken } = require('../utils/jwt');

/**
 * Protects admin routes.
 * Accepts: Authorization: Bearer <JWT>
 */
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required',
        });
    }

    if (!config.jwt_secret) {
        logger.warn('JWT_SECRET is not set — blocking authenticated route');
        return res.status(503).json({
            success: false,
            message: 'Admin authentication is not configured',
        });
    }

    const token = authHeader.slice(7).trim();

    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token',
        });
    }
};

module.exports = {
    authenticate,
};
