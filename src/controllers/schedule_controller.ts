import { HttpError, DBContext } from 'tymon';

import BaseController from './base/base_controller';
import AuthMiddleware from '../middlewares/basic';
import { IContext, IData, IHandlerOutput } from 'src/typings/common';
import MilooService from '../services/miloo_service';
import * as bluebird from 'bluebird';
import UserRepository from '../repositories/user_repo';
import NotificationService from '../services/notification_service';

export default class ScheduleController extends BaseController {
    public constructor() {
        super();
        this.setMiddleware(AuthMiddleware);
    }

    public async notifyCovid19(data: IData, context: IContext): Promise<IHandlerOutput> {
        const covid19Data = await MilooService.getCovid19Data(false);
        await NotificationService.sendCovidNotification(covid19Data);

        return {
            message: 'all user notified',
            data: covid19Data
        };
    }

    protected setRoutes(): void {
        this.addRoute('post', '/covid19', this.notifyCovid19);
    }
}
