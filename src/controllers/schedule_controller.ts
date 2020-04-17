import { HttpError, DBContext } from 'tymon';

import BaseController from './base/base_controller';
import AuthMiddleware from '../middlewares/firebase';
import EmblemRepository from '../repositories/emblem_repo';
import { IContext, IData, IHandlerOutput } from 'src/typings/common';

export default class EmblemContoller extends BaseController {
    public constructor() {
        super();
        this.setMiddleware(AuthMiddleware);
    }

    public async notifyCovid19(data: IData, context: IContext): Promise<IHandlerOutput> {
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

    protected setRoutes(): void {
        this.addRoute('post', '/covid19', this.notifyCovid19);
    }
}
