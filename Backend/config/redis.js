import { createClient } from "ioredis";

const redis = new createClient({
  url: process.env.UPSTASH_REDIS_URL, // Use the Redis URL from .env
  tls: { rejectUnauthorized: false }, // Required for Upstash
});

redis.on("error", (err) => console.error("Redis Error:", err));

export default redis;
