require('dotenv').config();

const config = {
    node_env: process.env.NODE_ENV || 'development',
    port: Number(process.env.PORT) || 8000,
    client_url: process.env.CLIENT_URL || '',
    app_url:
        process.env.APP_URL ||
        (process.env.CLIENT_URL || '').split(',')[0].trim() ||
        'http://localhost:3000',
    mongodb_uri:
        process.env.MONGODB_URI || process.env.MONGO_URL || process.env.MONGO_URI || '',

    // SMTP Email Configuration
    smtp_host: process.env.SMTP_HOST,
    smtp_port: process.env.SMTP_PORT,
    smtp_secure: process.env.SMTP_SECURE === "true",
    smtp_user: process.env.SMTP_USER,
    smtp_pass: process.env.SMTP_PASS,

    user: {
        email: process.env.EMAIL,
        password: process.env.PASSWORD,
    },

    // Admin email configuration
    admin_email: process.env.ADMIN_EMAIL,

    // Outbound email branding (Trika Wellness)
    mail_from_name: process.env.MAIL_FROM_NAME || 'Trika Wellness',
    mail_from_email:
        process.env.MAIL_FROM_EMAIL || process.env.SMTP_USER || 'soniarazdan4@gmail.com',

    jwt_secret: process.env.JWT_SECRET,
    admin_api_key: process.env.ADMIN_API_KEY || '',

};

module.exports = config;
