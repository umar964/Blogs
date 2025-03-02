const { Redis } = require("@upstash/redis");

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_URL, // ✅ Ensure this is set
});

module.exports = redis; // ✅ CommonJS Export







