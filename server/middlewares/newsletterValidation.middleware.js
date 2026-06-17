const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateNewsletter = (req, res, next) => {
    const { email } = req.body;
    const errors = [];

    if (!email || !EMAIL_REGEX.test(email.trim())) {
        errors.push('Valid email is required');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors,
        });
    }

    next();
};

const validateNewsletterCampaign = (req, res, next) => {
    const { subject, content } = req.body;
    const errors = [];

    if (!subject || typeof subject !== 'string' || !subject.trim()) {
        errors.push('Subject is required');
    } else if (subject.trim().length > 200) {
        errors.push('Subject cannot exceed 200 characters');
    }

    if (!content || typeof content !== 'string' || !content.trim()) {
        errors.push('Content is required');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors,
        });
    }

    next();
};

module.exports = {
    validateNewsletter,
    validateNewsletterCampaign,
};
