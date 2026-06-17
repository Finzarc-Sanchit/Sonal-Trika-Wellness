const config = require('../config/config');
const { matchPassword } = require('../utils/authentication');
const { generateToken } = require('../utils/jwt');

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = config.user;

        if (!user.email || !user.password) {
            return res.status(503).json({
                success: false,
                message: 'Admin login is not configured',
            });
        }

        if (!config.jwt_secret) {
            return res.status(503).json({
                success: false,
                message: 'JWT_SECRET is not configured',
            });
        }

        if (email !== user.email) {
            return res.status(400).json({ success: false, message: 'Incorrect credentials' });
        }

        const isPasswordMatch = await matchPassword(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ success: false, message: 'Incorrect credentials' });
        }

        const token = generateToken(user);

        res.status(200).json({ success: true, message: 'Login Successful!', token });
    } catch (error) {
        return next(error);
    }
};

const me = async (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Authenticated',
        data: { email: req.user.email },
    });
};

module.exports = { login, me };
