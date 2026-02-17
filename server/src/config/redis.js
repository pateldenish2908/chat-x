const Redis = require('ioredis');
const config = require('./env');

const redisClient = new Redis(config.REDIS_URL, {
    maxRetriesPerRequest: null,
    retryStrategy: (times) => {
        // Try to reconnect every 5 seconds if offline
        return 50000;
    },
});

redisClient.isReady = false;

redisClient.on('connect', () => {
    redisClient.isReady = true;
    console.log('✅ Redis connected');
});

let lastRedisError = 0;
redisClient.on('error', (err) => {
    redisClient.isReady = false;
    // Log error only once every 30 seconds to avoid spam
    if (Date.now() - lastRedisError > 30000) {
        console.error('Redis offline (check if service is running):', err.message);
        lastRedisError = Date.now();
    }
});

redisClient.on('close', () => {
    redisClient.isReady = false;
});

module.exports = redisClient;
