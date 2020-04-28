import { HttpError } from 'tymon';

import BaseController from '../base/base_controller';
import AdminRepository from '../../repositories/admin_repo';
import { IData, IContext, IHandlerOutput } from 'src/typings/common';
import { validatePassword, generateToken } from '../../libs/jwt';
import Validator from '../../middlewares/request_validator';
import AuthMiddleware from '../../middlewares/auth';

export default class AdminAuthController extends BaseController {
    public async login(data: IData, context: IContext): Promise<IHandlerOutput> {
        try {
            const { body } = data;

            const adminRepo = new AdminRepository();
            const admin = await adminRepo.findOne({ username: body.username });

            if (!admin) {
                throw HttpError.NotAuthorized(null, 'CREDENTIAL_NOT_MATCH');
            }

            if (!validatePassword(body.password, admin.password)) {
                throw HttpError.NotAuthorized(null, 'CREDENTIAL_NOT_MATCH');
            }

            const token = generateToken({ user_id: admin.id });

            return {
                message: 'auth success',
                data: {
                    token,
                    expires_in: Number(process.env.JWT_LIFETIME)
                }
            };
        } catch (err) {
            if (err.status) throw err;
            throw HttpError.InternalServerError(err.message);
        }
    }

    public async profile(data: IData, context: IContext): Promise<IHandlerOutput> {
        try {
            const adminRepo = new AdminRepository();
            const admin = await adminRepo.findOne({ id: context.user_id });

            if (!admin) {
                throw HttpError.NotFound(null, 'ADMIN_NOT_FOUND');
            }

            return {
                message: 'auth success',
                data: {
                    id: admin.id,
                    name: admin.name,
                    username: admin.username,
                    created_at: admin.created_at
                }
            };
        } catch (err) {
            if (err.status) throw err;
            throw HttpError.InternalServerError(err.message);
        }
    }

    public setRoutes(): void {
        this.addRoute('get', '/profile', this.profile, AuthMiddleware);
        this.addRoute('post', '/auth', this.login, Validator('adminAuth'));
    }
}
