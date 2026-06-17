const sanitizeContact = (req, res, next) => {
    // Updated sanitation targets to clean up live schema payload variables
    if (typeof req.body.name === 'string') {
        req.body.name = req.body.name.trim();
    }
    if (typeof req.body.phone === 'string') {
        req.body.phone = req.body.phone.trim();
    }
    if (typeof req.body.email === 'string') {
        req.body.email = req.body.email.trim().toLowerCase();
    }
    if (typeof req.body.message === 'string') {
        req.body.message = req.body.message.trim();
    }

    next();
};

module.exports = {
    sanitizeContact,
};