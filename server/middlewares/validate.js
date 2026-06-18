const { validationResult, body } = require('express-validator');

/**
 * Universal validation engine runner that processes rulesets concurrently
 * and intercepts errors in our standard API envelope.
 */
const validate = (rules) => {
    return async (req, res, next) => {
        await Promise.all(rules.map((rule) => rule.run(req)));

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        return res.status(400).json({
            success: false,
            message: 'Validation failed. Please correct the highlighted fields.',
            errors: errors.array().map((err) => ({
                field: err.path || err.param,
                message: err.msg,
            })),
        });
    };
};

const sharedRules = {
    name: body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ max: 120 })
        .withMessage('Name cannot exceed 120 characters')
        .escape(),
    phone: body('phone')
        .trim()
        .notEmpty()
        .withMessage('Phone number is required')
        .isLength({ max: 30 })
        .withMessage('Phone number cannot exceed 30 characters'),
    email: body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),
};

const schemas = {
    contact: [
        sharedRules.name,
        sharedRules.email,
        sharedRules.phone,
        body('service')
            .trim()
            .notEmpty()
            .withMessage('Service selection is required')
            .isIn([
                'chakra-therapy',
                'ocean-therapy',
                'clinical-protocols',
                'corporate-wellness',
                'retreats-and-festivals',
                'new-moon-full-moon-sound-bath',
                'beginner-sound-healing-workshop',
                'gong-and-bowl-learning-modules',
            ])
            .withMessage('Invalid or unrecognized service selection option'),
        body('message')
            .trim()
            .notEmpty()
            .withMessage('Message is required')
            .isLength({ max: 5000 })
            .withMessage('Message cannot exceed 5000 characters')
            .escape(),
    ],
    newsletter: [sharedRules.email],
    newsletterCampaign: [
        body('subject')
            .trim()
            .notEmpty()
            .withMessage('Subject is required')
            .isLength({ max: 200 })
            .withMessage('Subject cannot exceed 200 characters'),
        body('content').trim().notEmpty().withMessage('Content is required'),
    ],
    retreat: [
        sharedRules.name,
        sharedRules.email,
        sharedRules.phone,
        body('location')
            .trim()
            .customSanitizer((value) =>
                typeof value === 'string' ? value.toLowerCase() : value,
            )
            .notEmpty()
            .withMessage('Retreat location is required')
            .isIn(['rishikesh', 'jaisalmer', 'sri-lanka', 'gangtok'])
            .withMessage('Invalid retreat destination selected'),
        body('details')
            .trim()
            .notEmpty()
            .withMessage('Details/requirements are required')
            .isLength({ max: 5000 })
            .withMessage('Details cannot exceed 5000 characters')
            .escape(),
    ],
    login: [
        sharedRules.email,
        body('password').notEmpty().withMessage('Password is required'),
    ],
};

module.exports = { validate, schemas };
