const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./config/config');
const { getAllowedOrigins, isOriginAllowed } = require('./config/cors');
const connectDB = require('./config/db');
const logger = require('./config/logger');
const router = require('./routes/index');
const notFound = require('./middlewares/notFoundMiddleware');
const errorHandler = require('./middlewares/errorMiddleware');

const app = express();

connectDB();

const allowedOrigins = getAllowedOrigins();

logger.info(`CORS allowed origins: ${allowedOrigins.join(', ')}`);

app.use(helmet());

app.use(
    cors({
        origin(origin, callback) {
            if (!origin) {
                logger.info('CORS: Allowing request with no origin');
                return callback(null, true);
            }

            if (isOriginAllowed(origin)) {
                logger.info(`CORS: Allowing origin: ${origin}`);
                callback(null, true);
            } else {
                logger.warn(
                    `CORS blocked origin: ${origin}. Allowed origins: ${allowedOrigins.join(', ')}`,
                );
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
        preflightContinue: false,
        optionsSuccessStatus: 204,
    }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    morgan('combined', {
        stream: {
            write: (message) => logger.info(message.trim()),
        },
    }),
);

app.get('/', (req, res) => {
    logger.info('Root route hit');
    res.status(200).json({ success: true, message: 'Hello' });
});

app.use('/api/v1', router);

app.use(notFound);
app.use(errorHandler);

const PORT = config.port || 8000;

app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT} (${config.node_env})`);
});
