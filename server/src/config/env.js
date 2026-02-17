const dotenv = require('dotenv');
const path = require('path');

const env = process.env.NODE_ENV || 'development';
const envPath = path.resolve(__dirname, `../../.env.${env}`);
const baseEnvPath = path.resolve(__dirname, '../../.env');

// 1. Load environment-specific .env first
dotenv.config({ path: envPath, override: false });

// 2. Load base .env for missing variables
dotenv.config({ path: baseEnvPath, override: false });

module.exports = {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT || 5000,
    MONGO_URI: process.env.MONGO_URI,
    FRONTEND_URL: process.env.FRONTEND_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY,
    REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY,
    REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
};
