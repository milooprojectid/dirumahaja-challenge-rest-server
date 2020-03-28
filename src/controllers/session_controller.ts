import { HttpError, DBContext } from 'tymon';
import * as moment from 'moment';
import { getDistance } from 'geolib';

import Validator from '../middlewares/request_validator';
import BaseController from './base/base_controller';
import AuthMiddleware from '../middlewares/firebase';
import { IContext, IData, IHandlerOutput } from '../typings/common';
import { CheckinPayload } from 'src/typings/method';
import SessionService from '../services/session_service';
import UserService from '../services/user_service';
import { parseCoordinate2 } from '../utils/helpers';
import { MAX_HOME_RADIUS } from '../utils/constant';

import PunishmentRepository from '../repositories/punishment_repo';
import RedisRepo from '../repositories/base/redis_repository';

export default class SessionController extends BaseController {
    public constructor() {
        super();
        this.setMiddleware(AuthMiddleware);
    }

    public async checkin(data: IData, context: IContext): Promise<IHandlerOutput> {
        try {
            const { body }: CheckinPayload = data;

            const user = await UserService.getById(context.user_id);
            const session = await SessionService.getActiveSession(context.user_id);

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
            setImmediate(
                async (): Promise<void> => {
                    const payload = {
                        coordinate: body.coordinate,
                        next_log: body.next_checkin
                    };
                    isValid
                        ? await SessionService.avoided(session, payload)
                        : await SessionService.hitted(session, payload);
                }
            );

            return {
                message: 'checkin success',
                data: {
                    is_valid: isValid
                }
            };
        } catch (err) {
            if (err.status) throw err;
            throw HttpError.InternalServerError(err.message);
        }
    }

    public async getPunishments(data: IData, context: IContext): Promise<IHandlerOutput> {
        try {
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
        } catch (err) {
            if (err.status) throw err;
            throw HttpError.InternalServerError(err.message);
        }
    }

    public setRoutes(): void {
        this.addRoute('post', '/checkin', this.checkin, Validator('checkin'));
        this.addRoute('get', '/punishments', this.getPunishments);
    }
}
