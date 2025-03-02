import { Redis } from "@upstash/redis";

const redis = new Redis({
    url:process.env.UPSTASH_REDIS_URL 
});

export default redis;




