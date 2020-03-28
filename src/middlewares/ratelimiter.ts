import { RedisContext } from 'tymon';
import * as rateLimit from 'express-rate-limit';
const redisStore = require('rate-limit-redis');

export default ({ time, limit }: { time: number; limit: number } = { time: 1, limit: 30 }): any => {
    const redisClient = RedisContext.getInstance();
    return rateLimit({
        store: new redisStore({
            client: redisClient
        }),
        windowMs: time * 60 * 1000, // 1 minutes default
        max: limit // 10 times default
    });
};
