import { HttpError } from 'tymon';

import { IContext, IData, IHandlerOutput } from 'src/typings/common';
import Validator from '../middlewares/request_validator';
import AuthMiddleware from '../middlewares/basic';
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
import { Notification } from '../typings/models';
import { CACHE_TTL } from '../utils/constant';
import MilooService from '../services/miloo_service';

export default class ProfileController extends BaseController {
    public constructor() {
        super();
        this.setMiddleware(AuthMiddleware);
    }

    public async getProfile(data: IData, context: IContext): Promise<IHandlerOutput> {
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

            await redisRepo.create(context.user_id, returnPayload, CACHE_TTL);
        }

        return {
            message: 'profile data retrieved',
            data: returnPayload
        };
    }

    public async getRelations(data: IData, context: IContext): Promise<IHandlerOutput> {
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
            await redisRepo.create(context.user_id, returnPayload, CACHE_TTL);
        }

        return {
            message: 'relation data retrieved',
            data: returnPayload
        };
    }

    public async getNotification(data: IData, context: IContext): Promise<IHandlerOutput> {
        const notificationRepo = new NotificationRepository();
        const redisRepo = new RedisRepo('notification');

        let notifications: Notification[] = await redisRepo.findOne(context.user_id);
        if (!notifications) {
            notifications = await notificationRepo.findAll({ user_id: context.user_id });
            await redisRepo.create(context.user_id, notifications, CACHE_TTL);
        }

        return {
            message: 'notification data retrieved',
            data: notifications.map((item): any => JSON.parse(item.body))
        };
    }

    public async getCovidData(data: IData, context: IContext): Promise<IHandlerOutput> {
        let covidData = await MilooService.getCovid19Data();
        return {
            message: 'covid-19 data retrieved',
            data: covidData
        };
    }

    protected setRoutes(): void {
        this.addRoute('get', '/', this.getProfile, Validator('profile'));
        this.addRoute('get', '/relation', this.getRelations, Validator('profile'));
        this.addRoute('get', '/notification', this.getNotification);
        this.addRoute('get', '/covid', this.getCovidData);
    }
}
