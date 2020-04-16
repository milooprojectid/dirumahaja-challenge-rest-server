import { HttpError, DBContext } from 'tymon';

import BaseController from './base/base_controller';
import Validator from '../middlewares/request_validator';
import AuthMiddleware from '../middlewares/firebase';
import UserEmblemRepository from '../repositories/user_emblem_repo';
import EmblemRepository from '../repositories/emblem_repo';
import { IContext, IData, IHandlerOutput } from 'src/typings/common';
import UserService from '../services/user_service';

export default class EmblemContoller extends BaseController {
    public constructor() {
        super();
        this.setMiddleware(AuthMiddleware);
    }

    public async getEmblems(data: IData, context: IContext): Promise<IHandlerOutput> {
        try {
            const emblemRepo = new EmblemRepository();
            const emblems = await emblemRepo.findAll({}, 'id', ['code', 'name', 'img_url']);

            return {
                message: 'all emblem retrieved',
                data: emblems
            };
        } catch (err) {
            if (err.status) throw err;
            throw HttpError.InternalServerError(err.message);
        }
    }

    public async getMyEmblems(data: IData, context: IContext): Promise<IHandlerOutput> {
        try {
            const userEmblemRepo = new UserEmblemRepository();
            const emblems = await userEmblemRepo.getAllUserEmblem(context.user_id);

            return {
                message: 'user emblem retrieved',
                data: emblems.map((item): any => ({
                    id: item.id,
                    is_active: item.is_active,
                    code: item.emblem?.code,
                    name: item.emblem?.name,
                    img_url: item.emblem?.img_url
                }))
            };
        } catch (err) {
            if (err.status) throw err;
            throw HttpError.InternalServerError(err.message);
        }
    }

    public async setCurrentEmblem(data: IData, context: IContext): Promise<IHandlerOutput> {
        try {
            await DBContext.startTransaction();

            const { params } = data;
            const userEmblemRepo = new UserEmblemRepository();

            const emblem = await userEmblemRepo.findOne({ user_id: context.user_id, id: params.id });
            if (!emblem) {
                throw HttpError.NotFound(null, 'EMBLEM_NOT_FOUD');
            }

            await userEmblemRepo.update({ user_id: context.user_id }, { is_active: false });
            await Promise.all([
                userEmblemRepo.update({ id: emblem.id }, { is_active: true }),
                UserService.bustProfileCache(context.user_id)
            ]);

            await DBContext.commit();

            return {
                message: 'user emblem changed',
                data: null
            };
        } catch (err) {
            await DBContext.rollback();
            if (err.status) throw err;
            throw HttpError.InternalServerError(err.message);
        }
    }

    protected setRoutes(): void {
        this.addRoute('get', '/', this.getMyEmblems);
        this.addRoute('get', '/all', this.getEmblems);
        this.addRoute('put', '/:id', this.setCurrentEmblem, Validator('setEmblem'));
    }
}
