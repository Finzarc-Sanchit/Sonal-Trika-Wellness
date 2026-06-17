const jwt = require('jsonwebtoken');
const config = require('../config/config');

function generateToken(user) {
    if (!config.jwt_secret) {
        throw new Error('JWT_SECRET is not configured');
    }

    return jwt.sign(
        { email: user.email },
        config.jwt_secret,
        { expiresIn: '7d' },
    );
}

function verifyToken(token) {
    if (!config.jwt_secret) {
        throw new Error('JWT_SECRET is not configured');
    }

    return jwt.verify(token, config.jwt_secret);
}

module.exports = {
    generateToken,
    verifyToken,
};
