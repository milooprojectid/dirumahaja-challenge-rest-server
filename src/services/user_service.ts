import { HttpError } from 'tymon';
import UserRepository from '../repositories/user_repo';
import RedisRepository from '../repositories/base/redis_repository';
import { User } from 'src/typings/models';
import { Complete } from 'src/typings/common';
import RelationRepository from '../repositories/relation_repo';
import { relationCreatepayload } from '../utils/transformer';

import Worker from '../jobs';
import NotificationRepository from '../repositories/notification_repo';
import SessionRepository from '../repositories/session_repo';
import SessionService from './session_service';
import { sendToTopic } from '../utils/notification';
import { NOTIFICATION, EMBLEM_CODE } from '../utils/constant';
import EmblemService from './emblem_service';

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

    public static async pair(userIdA: string, userIdB: string): Promise<void> {
        const relationRepo = new RelationRepository();

        const payloadA = relationCreatepayload(userIdA, userIdB);
        const payloadB = relationCreatepayload(userIdB, userIdA);
        await Promise.all([relationRepo.upsert(payloadA, payloadA), relationRepo.upsert(payloadB, payloadB)]);

        await Worker.dispatch(Worker.Job.RELATION_ADDED, { user_id: userIdB });
    }

    public static async addHealth(userId: string): Promise<void> {
        const notifRepo = new NotificationRepository();
        const sessionRepo = new SessionRepository();

        const session = await SessionService.getActiveSession(userId);
        const newHealth = session.health + 1;

        await Promise.all([
            sessionRepo.update({ id: session.id }, { health: newHealth }),
            notifRepo.create({
                user_id: userId,
                text: NOTIFICATION.WIN.text,
                img_url: NOTIFICATION.WIN.icon
            }),
            sendToTopic({
                topic: userId,
                data: NOTIFICATION.WIN,
                notification: { title: 'Yuhuu, kamu mendapatkan nyawa' }
            })
        ]);

        switch (newHealth) {
            case 3: {
                await EmblemService.attach(userId, EMBLEM_CODE.PRINCESS_WABAH);
                break;
            }
            case 9: {
                await EmblemService.attach(userId, EMBLEM_CODE.KUCING_AJA_KALAH);
                break;
            }
            default:
                break;
        }
    }
}
