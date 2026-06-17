const mongoose = require('mongoose');
const logger = require('./logger');
const config = require('./config');

const connectDB = async () => {
    const uri = config.mongodb_uri;

    if (!uri) {
        logger.error(
            'MONGODB_URI is not set. Add it to server/.env (see .env.example).',
        );
        process.exit(1);
    }

    try {
        const connection = await mongoose.connect(uri);
        logger.info(`MongoDB connected: ${connection.connection.host}`);
    } catch (error) {
        logger.error(`MongoDB connection error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
