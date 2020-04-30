import { HttpError, DBContext, FirebaseContext } from 'tymon';

import Validator from '../middlewares/request_validator';
import BaseController from './base/base_controller';
import { IContext, IData, IHandlerOutput, IFirebaseToken } from '../typings/common';
import { RegisterPayload } from 'src/typings/method';
import { userCreatePayload, userUpdatePayload } from '../utils/transformer';
import SessionService from '../services/session_service';
import UserRepository from '../repositories/user_repo';
import EmblemService from '../services/emblem_service';
import { EMBLEM_CODE } from '../utils/constant';
import UserService from '../services/user_service';
import Worker from '../jobs';
import { UserRegisteredData } from 'src/typings/worker';
import { User } from 'src/typings/models';

export default class AuthController extends BaseController {
    public async register(data: IData, context: IContext): Promise<IHandlerOutput> {
        try {
            await DBContext.startTransaction();

            const { body }: RegisterPayload = data;
            const userRepo = new UserRepository();

            /** verify firebase id token */
            const firebase = await FirebaseContext.getInstance();
            let firebaseUser: IFirebaseToken;
            try {
                firebaseUser = await firebase.auth().verifyIdToken(body.id_token);
            } catch (err) {
                throw HttpError.NotAuthorized('TOKEN_INVALID');
            }

            let exsistingUser: User | undefined;
            if (body.uid) {
                exsistingUser = await userRepo.findOne({ uid: body.uid });
            }

            if (!exsistingUser) {
                /** check id uid or username already exist */
                const [userExsist, usernameExsist] = await Promise.all([
                    userRepo.findOne({ uid: firebaseUser.uid }),
                    userRepo.findOne({ username: body.username })
                ]);

                if (userExsist || usernameExsist) {
                    throw HttpError.BadRequest(null, 'USER_ALREADY_EXIST');
                }

                /** generate new user */
                const payload = userCreatePayload(data);
                const user = await userRepo.create(payload);

                /** initialize session and generate user emblem */
                await Promise.all([
                    SessionService.initializeNewSession(firebaseUser.uid),
                    EmblemService.attach(user.id, EMBLEM_CODE.HERO_ONE, true)
                ]);

                /** dispatch async job */
                await Worker.dispatch<UserRegisteredData>(Worker.Job.USER_REGISTERED, {
                    user,
                    challenger_id: body.challenger
                });
            } else {
                const payload = userUpdatePayload(exsistingUser, firebaseUser);
                await userRepo.update({ id: exsistingUser.id }, payload);
            }

            await DBContext.commit();

            return {
                message: 'registration success',
                data: data
            };
        } catch (err) {
            await DBContext.rollback();
            throw err;
        }
    }

    public async checkUsernameAvailability(data: IData, context: IContext): Promise<IHandlerOutput> {
        const { body }: RegisterPayload = data;
        const userRepo = new UserRepository();

        const userExist = await userRepo.findOne({ username: body.username });

        return {
            message: 'check username success',
            data: {
                is_exist: !!userExist
            }
        };
    }

    public setRoutes(): void {
        this.addRoute('post', '/register', this.register, Validator('register'));
        this.addRoute('post', '/check', this.checkUsernameAvailability, Validator('checkUsername'));
    }
}
