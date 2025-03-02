import { Redis } from "@upstash/redis";

console.log("🔍 Redis URL:", process.env.UPSTASH_REDIS_URL); // ✅ Debugging

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_URL, // 🛑 Check if this is undefined
});

export default redis;






