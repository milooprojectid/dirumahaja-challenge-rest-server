import { HttpError } from 'tymon';

import { IContext, IData, IHandlerOutput } from 'src/typings/common';
import Validator from '../middlewares/request_validator';
import AuthMiddleware from '../middlewares/firebase';
import UserRepository from '../repositories/user_repo';
import UserEmblemRepository from '../repositories/user_emblem_repo';
import RedisRepository from '../repositories/base/redis_repository';
import BaseController from './base/base_controller';
import SessionService from '../services/session_service';
import { profile } from '../utils/transformer';
import { GetProfilePayload } from 'src/typings/method';

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
                returnPayload = profile(user, emblem, session);

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

    protected setRoutes(): void {
        this.addRoute('get', '/', this.getProfile, Validator('profile'));

        /** nested controllers */
        // this.addChildController(new Controller());
    }
}
