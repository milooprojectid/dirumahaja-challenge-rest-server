import { HttpError, DBContext } from 'tymon';

import Validator from '../middlewares/request_validator';
import BaseController from './base/base_controller';
import { IContext, IData, IHandlerOutput } from '../typings/common';
import { RegisterPayload } from 'src/typings/method';
import { userCreatePayload, userEmblemCreatePayload, relationCreatepayload } from '../utils/transformer';
import SessionService from '../services/session_service';
import UserRepository from '../repositories/user_repo';
import RelationRepository from '../repositories/relation_repo';
import EmblemRepository from '../repositories/user_emblem_repo';

export default class AuthController extends BaseController {
    public async register(data: IData, context: IContext): Promise<IHandlerOutput> {
        try {
            await DBContext.startTransaction();

            const { body }: RegisterPayload = data;

            const userRepo = new UserRepository();
            const userEmblemRepo = new EmblemRepository();
            const relationRepo = new RelationRepository();

            /** check id uid or username already exist */
            const [user, username] = await Promise.all([
                userRepo.findOne({ id: body.uid }),
                userRepo.findOne({ username: body.username })
            ]);

            if (user || username) {
                throw HttpError.BadRequest(null, 'USER_ALREADY_EXIST');
            }

            /** generate new user */
            const payload = userCreatePayload(data);
            await userRepo.create(payload);

            /** generate relation */
            if (body.challenger) {
                const challenger = await userRepo.findOne({ username: body.challenger });
                if (!challenger) {
                    throw HttpError.NotFound(null, 'CHALLENGER_NOT_FOUND');
                }
                await Promise.all([
                    relationRepo.create(relationCreatepayload(body.uid, body.challenger)),
                    relationRepo.create(relationCreatepayload(body.challenger, body.uid))
                ]);
            }

            /** initialize session */
            await SessionService.initializeNewSession(body.uid);

            /** generate user emblem */
            await userEmblemRepo.create(userEmblemCreatePayload(body.uid));

            await DBContext.commit();

            return {
                message: 'registration success',
                data: {}
            };
        } catch (err) {
            await DBContext.rollback();
            if (err.status) throw err;
            throw HttpError.InternalServerError(err.message);
        }
    }

    public async checkUsernameAvailability(data: IData, context: IContext): Promise<IHandlerOutput> {
        try {
            const { body }: RegisterPayload = data;
            const userRepo = new UserRepository();

            const userExist = await userRepo.findOne({ username: body.username });

            return {
                message: 'check username success',
                data: {
                    is_exist: !!userExist
                }
            };
        } catch (err) {
            if (err.status) throw err;
            throw HttpError.InternalServerError(err.message);
        }
    }

    public setRoutes(): void {
        this.addRoute('post', '/register', this.register, Validator('register'));
        this.addRoute('post', '/check', this.checkUsernameAvailability, Validator('checkUsername'));
    }
}
