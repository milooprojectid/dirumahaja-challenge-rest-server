import { HttpError } from 'tymon';

import { IContext, IData, IHandlerOutput } from 'src/typings/common';
import Validator from '../middlewares/request_validator';
import AuthMiddleware from '../middlewares/firebase';
import UserRepository from '../repositories/user_repo';
import RelationRepository from '../repositories/relation_repo';
import UserEmblemRepository from '../repositories/user_emblem_repo';
import NotificationRepository from '../repositories/notification_repo';
import RedisRepository from '../repositories/base/redis_repository';
import BaseController from './base/base_controller';
import SessionService from '../services/session_service';
import { profileOutput, relationsOutput } from '../utils/transformer';
import { GetProfilePayload } from 'src/typings/method';
import RedisRepo from '../repositories/base/redis_repository';

export default class ProfileController extends BaseController {
    public constructor() {
        super();
        this.setMiddleware(AuthMiddleware);
    }

    public async getProfile(data: IData, context: IContext): Promise<IHandlerOutput> {
        try {
            const { query }: GetProfilePayload = data;

            const userRepo = new UserRepository();
            const userEmblemRepo = new UserEmblemRepository();
            const redisRepo = new RedisRepository('profile');

            let returnPayload: any;
            if (query.cache) {
                returnPayload = await redisRepo.findOne(context.user_id);
            }

            if (!returnPayload) {
                const user = await userRepo.findOne({ id: context.user_id });
                if (!user) {
                    throw HttpError.NotFound(null, 'USER_NOT_FOUND');
                }

                const emblem = await userEmblemRepo.getActiveEmblem(context.user_id);
                if (!emblem) {
                    throw HttpError.NotFound(null, 'EMBLEM_NOT_FOUND');
                }

                const session = await SessionService.getActiveSession(context.user_id);
                returnPayload = profileOutput(user, emblem, session);

                await redisRepo.create(context.user_id, returnPayload, 600);
            }

            return {
                message: 'profile data retrieved',
                data: returnPayload
            };
        } catch (err) {
            if (err.status) throw err;
            throw HttpError.InternalServerError(err.message);
        }
    }

    public async getRelations(data: IData, context: IContext): Promise<IHandlerOutput> {
        try {
            const { query }: GetProfilePayload = data;

            const relationRepo = new RelationRepository();
            const redisRepo = new RedisRepository('relation');

            let returnPayload: any;
            if (query.cache) {
                returnPayload = await redisRepo.findOne(context.user_id);
            }

            if (!returnPayload) {
                const relations = await relationRepo.getDetailedRelations(context.user_id);
                returnPayload = relationsOutput(relations);
                await redisRepo.create(context.user_id, returnPayload, 600);
            }

            return {
                message: 'relation data retrieved',
                data: returnPayload
            };
        } catch (err) {
            if (err.status) throw err;
            throw HttpError.InternalServerError(err.message);
        }
    }

    public async getNotification(data: IData, context: IContext): Promise<IHandlerOutput> {
        try {
            const notificationRepo = new NotificationRepository();
            const redisRepo = new RedisRepo('notification');

            let notifications: any[] = await redisRepo.findOne(context.user_id);
            if (!notifications) {
                notifications = await notificationRepo.findAll({ user_id: context.user_id });
                await redisRepo.create(context.user_id, notifications, 600);
            }

            return {
                message: 'notification data retrieved',
                data: notifications.map((item): any => ({
                    text: item.text,
                    img_url: item.img_url
                }))
            };
        } catch (err) {
            if (err.status) throw err;
            throw HttpError.InternalServerError(err.message);
        }
    }

    protected setRoutes(): void {
        this.addRoute('get', '/', this.getProfile, Validator('profile'));
        this.addRoute('get', '/relation', this.getRelations, Validator('profile'));
        this.addRoute('get', '/notification', this.getNotification);

        /** nested controllers */
        // this.addChildController(new Controller());
    }
}
