const createRateLimit = ({ windowMs = 15 * 60 * 1000, maxRequests = 5 } = {}) => {
    const requests = new Map();

    return (req, res, next) => {
        const clientId = req.ip || req.socket?.remoteAddress || 'unknown';
        const now = Date.now();

        if (!requests.has(clientId)) {
            requests.set(clientId, []);
        }

        const clientRequests = requests.get(clientId);
        const validRequests = clientRequests.filter((time) => now - time < windowMs);
        requests.set(clientId, validRequests);

        if (validRequests.length >= maxRequests) {
            return res.status(429).json({
                success: false,
                message: 'Too many requests. Please try again later.',
                retryAfter: Math.ceil(windowMs / 1000),
            });
        }

        validRequests.push(now);
        next();
    };
};

const rateLimit = createRateLimit({
    windowMs: 15 * 60 * 1000,
    maxRequests: 5,
});



module.exports = {
    createRateLimit,
    rateLimit,
};
