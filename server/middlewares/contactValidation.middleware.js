const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+]?[\d\s()-]{7,30}$/;

const validateContact = (req, res, next) => {
    // Aligned strictly with our mongoose model schema keys
    const { name, phone, email, message } = req.body;
    const errors = [];

    if (!name || name.trim().length < 2) {
        errors.push('Name must be at least 2 characters long');
    } else if (name.trim().length > 120) {
        errors.push('Name cannot exceed 120 characters');
    }

    if (!phone || !PHONE_REGEX.test(phone.trim())) {
        errors.push('A valid phone number is required (7-30 digits)');
    }

    if (!email || !EMAIL_REGEX.test(email.trim())) {
        errors.push('A valid email address is required');
    } else if (email.trim().length > 254) {
        errors.push('Email cannot exceed 254 characters');
    }

    if (!message || message.trim().length < 2) {
        errors.push('Message is required and must be at least 2 characters long');
    } else if (message.trim().length > 5000) {
        errors.push('Message cannot exceed 5000 characters');
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
    validateContact,
};