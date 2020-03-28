import { HttpError } from 'tymon';
import UserRepository from '../repositories/user_repo';
import RedisRepository from '../repositories/base/redis_repository';
import { User } from 'src/typings/models';
import { Complete } from 'src/typings/common';

export default class UserService {
    public static async getById(userId: string): Promise<Complete<User>> {
        try {
            const userRepo = new UserRepository();
            const redisRepo = new RedisRepository('user');

            let returnPayload: any = await redisRepo.findOne(userId);

            if (!returnPayload) {
                const user = await userRepo.findOne({ id: userId });
                if (!user) {
                    throw HttpError.NotFound(null, 'USER_NOT_FOUND');
                }
                await redisRepo.create(userId, user, 600);
                returnPayload = user;
            }

            return returnPayload;
        } catch (err) {
            throw HttpError.InternalServerError(`fail retrieving user data, ${err.message}`, 'USER_ERROR');
        }
    }

    public static async bustProfileCache(userId: string): Promise<void> {
        const redisRepo = new RedisRepository('profile');
        await redisRepo.delete(userId);
    }
}
