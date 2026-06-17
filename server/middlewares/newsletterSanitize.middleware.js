const sanitizeNewsletter = (req, res, next) => {
    if (typeof req.body.email === 'string') {
        req.body.email = req.body.email.trim().toLowerCase();
    }
    next();
};

module.exports = {
    sanitizeNewsletter,
};
