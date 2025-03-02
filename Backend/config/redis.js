const { Redis } = require("@upstash/redis");

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_URL,
});

module.exports = redis; // ✅ Exporting the redis instance properly





