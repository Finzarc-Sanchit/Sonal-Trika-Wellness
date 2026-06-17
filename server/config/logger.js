const { createLogger, format, transports } = require('winston');

const isProduction = process.env.NODE_ENV === 'production';

const logger = createLogger({
    level: isProduction ? 'info' : 'debug',
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.errors({ stack: true }),
        format.colorize(),
        format.printf(
            ({ timestamp, level, message, stack }) =>
                `[${timestamp}] ${level}: ${stack || message}`,
        ),
    ),
    transports: [
        new transports.Console(),
    ],
    exitOnError: false,
});

module.exports = logger;
