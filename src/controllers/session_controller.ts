import { HttpError } from 'tymon';
import * as moment from 'moment';
import { getDistance } from 'geolib';

import Validator from '../middlewares/request_validator';
import BaseController from './base/base_controller';
import AuthMiddleware from '../middlewares/firebase';
import { IContext, IData, IHandlerOutput } from '../typings/common';
import { CheckinPayload, SetSessionPunishmentPayload } from 'src/typings/method';
import SessionService from '../services/session_service';
import UserService from '../services/user_service';
import { parseCoordinate2 } from '../utils/helpers';
import { MAX_HOME_RADIUS, SESSION_STATUS } from '../utils/constant';

import PunishmentRepository from '../repositories/punishment_repo';
import RedisRepo from '../repositories/base/redis_repository';
import SessionRepository from '../repositories/session_repo';
import LogRepository from '../repositories/log_repo';

import Worker from '../jobs';
import { logListOutput } from '../utils/transformer';
import { UserCheckedInData } from 'src/typings/worker';

export default class SessionController extends BaseController {
    public constructor() {
        super();
        this.setMiddleware(AuthMiddleware);
    }

    public async checkin(data: IData, context: IContext): Promise<IHandlerOutput> {
        const { body }: CheckinPayload = data;

        const user = await UserService.getById(context.user_id);
        const session = await SessionService.getActiveSession(context.user_id);

        if (session.status != SESSION_STATUS.ON_GOING) {
            throw HttpError.BadRequest('SESSION_NOT_ELIGIBLE');
        }

        /** check time */
        let isValid = true;
        if (session.next_log) {
            isValid = moment(session.next_log) >= moment();
        }

        /** check coordinate */
        if (isValid) {
            const [lat, lng] = user.coordinate.coordinates;
            const logCoor = parseCoordinate2(body.coordinate);
            const distance = getDistance({ lat, lng }, logCoor);
            isValid = distance < MAX_HOME_RADIUS;
        }

        /** dispatch handler */
        await Worker.dispatch<UserCheckedInData>(Worker.Job.USER_CHECKIN, {
            session,
            log: { coordinate: body.coordinate, next_log: body.next_checkin },
            lose: !isValid
        });

        return {
            message: 'checkin success',
            data: {
                is_valid: isValid
            }
        };
    }

    public async getPunishments(data: IData, context: IContext): Promise<IHandlerOutput> {
        const punishmentRepo = new PunishmentRepository();
        const redisRepo = new RedisRepo('general');

        let punishments: any[] = await redisRepo.findOne('punishment');
        if (!punishments) {
            punishments = await punishmentRepo.findAll({}, 'id');
            await redisRepo.create('punishment', punishments);
        }

        return {
            message: 'punishments data retrieved',
            data: punishments.map((item): any => ({
                name: item.name,
                text: item.text,
                img_url: item.img_url
            }))
        };
    }

    public async setSessionPunishment(data: IData, context: IContext): Promise<IHandlerOutput> {
        const { body }: SetSessionPunishmentPayload = data;

        const sessionRepo = new SessionRepository();
        const session = await SessionService.getActiveSession(context.user_id);
        if (session.status != SESSION_STATUS.CLOSED) {
            throw HttpError.BadRequest(null, 'SESSION_NOT_ELIGIBLE');
        }

        await Promise.all([
            sessionRepo.update({ id: session.id }, { punishment: body.punishment }),
            UserService.bustProfileCache(context.user_id)
        ]);

        return {
            message: 'session punishment updated',
            data: null
        };
    }

    public async reInitiateSession(data: IData, context: IContext): Promise<IHandlerOutput> {
        const session = await SessionService.getActiveSession(context.user_id);

        if (session.status != SESSION_STATUS.CLOSED) {
            throw HttpError.BadRequest(null, 'SESSION_NOT_ELIGIBLE');
        }

        if (!session.punishment) {
            throw HttpError.BadRequest(null, 'SESSION_PUNISHMENT_NOT_SET');
        }

        await Promise.all([
            SessionService.initializeNewSession(context.user_id),
            UserService.bustProfileCache(context.user_id)
        ]);

        return {
            message: 'session restarted',
            data: null
        };
    }

    public async getCurrentSessionLogs(data: IData, context: IContext): Promise<IHandlerOutput> {
        const { query } = data;
        const logRepo = new LogRepository();

        const session = await SessionService.getActiveSession(context.user_id);
        const { data: logs, meta } = await logRepo.paginate({ session_id: session.id }, query);

        return {
            message: 'Logs retrieved',
            data: {
                data: logListOutput(logs),
                meta
            }
        };
    }

    public setRoutes(): void {
        this.addRoute('post', '/checkin', this.checkin, Validator('checkin'));
        this.addRoute('get', '/punishments', this.getPunishments);
        this.addRoute('post', '/punishments', this.setSessionPunishment, Validator('setPunishment'));
        this.addRoute('post', '/restart', this.reInitiateSession);
        this.addRoute('get', '/logs', this.getCurrentSessionLogs, Validator('logs'));
    }
}
