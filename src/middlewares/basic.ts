/// <reference types="../typings/express" />

import { Request, Response, NextFunction } from 'express';
import { HttpError } from 'tymon';
import { COMMON_ERRORS } from '../utils/constant';
import { IContext } from 'src/typings/common';

import UserRepository from '../repositories/user_repo';
import RedisRepository from '../repositories/base/redis_repository';

const generateContext = (uid: string): IContext => ({
    user_id: uid,
    username: uid
});

export default async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const uid = req.query.uid || req.headers.uid;
    if (!uid) {
        return next(HttpError.NotAuthorized(COMMON_ERRORS.TOKEN_INVALID));
    }

    let cache: any;
    let userId: string;

    /** get from redis */
    const redisRepo = await new RedisRepository('auth');
    cache = await redisRepo.findOne(uid);

    /** get from sql */
    if (!cache) {
        const userRepo = new UserRepository();
        const user = await userRepo.findOne({ uid });
        if (!user) {
            return next(HttpError.NotAuthorized(COMMON_ERRORS.TOKEN_INVALID));
        }
        userId = user.id;
        redisRepo.create(uid, { user_id: userId }, 600);
    } else {
        userId = cache.user_id;
    }

    req.context = generateContext(userId);
    return next();
};
