const config = require('./config.js');

const LOCAL_ORIGINS = [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:8080',
];

/** Production + Vercel preview URLs for the Kaditya Rao site */
const VERCEL_APP_ORIGIN_PATTERN =
    /^https:\/\/kadityarao(-[a-z0-9-]+)?\.vercel\.app$/i;

function parseClientUrls() {
    if (!config.client_url) return [];

    return config.client_url
        .split(',')
        .map((url) => url.trim())
        .filter(Boolean);
}

function getAllowedOrigins() {
    const fromEnv = parseClientUrls();
    return [...new Set([...fromEnv, ...LOCAL_ORIGINS])];
}

function isOriginAllowed(origin) {
    if (!origin) return true;

    const allowedOrigins = getAllowedOrigins();

    if (allowedOrigins.includes(origin)) {
        return true;
    }

    if (VERCEL_APP_ORIGIN_PATTERN.test(origin)) {
        return true;
    }

    return false;
}

module.exports = {
    getAllowedOrigins,
    isOriginAllowed,
};
