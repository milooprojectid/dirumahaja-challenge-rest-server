import { HttpError } from 'tymon';
import * as moment from 'moment';
import * as bluebird from 'bluebird';

import SessionRepository from '../repositories/session_repo';
import { SESSION_STATUS, LOG_STATUS, EMBLEM_CODE } from '../utils/constant';
import { initSessionPayload } from '../utils/transformer';
import { Session } from 'src/typings/models';
import UserService from './user_service';
import { parseCoordinate, timestamp } from '../utils/helpers';

import LogRepository from '../repositories/log_repo';
import RelationRepository from '../repositories/relation_repo';
import EmblemService from './emblem_service';
import NotificationService from './notification_service';

export default class SessionService {
    public static async initializeNewSession(userId: string): Promise<void> {
        try {
            const sessionRepo = new SessionRepository();
            await sessionRepo.update({ user_id: userId }, { status: SESSION_STATUS.CLOSED, is_active: false });

            const payload = initSessionPayload(userId);
            await sessionRepo.create(payload);
        } catch (err) {
            if (err.status) throw err;
            throw HttpError.InternalServerError(`fail generating new session, ${err.message}`);
        }
    }

    public static async getActiveSession(userId: string): Promise<Session> {
        try {
            const sessionRepo = new SessionRepository();
            const session = await sessionRepo.findOne({ user_id: userId, is_active: true });
            if (!session) {
                throw HttpError.NotFound('no active session found');
            }
            return session;
        } catch (err) {
            if (err.status) throw err;
            throw HttpError.InternalServerError(`fail generating new session, ${err.message}`, 'SESSION_ERROR');
        }
    }

    public static async hitted(session: Session, log: { coordinate: string; next_log: string }): Promise<void> {
        const sessionRepo = new SessionRepository();
        const relationRepo = new RelationRepository();
        const logRepo = new LogRepository();

        const newHealth = session.health - 1;
        const days = Math.abs(moment(session.start_time).diff(moment(), 'days'));

        const payload: { [s: string]: any } = { health: newHealth, next_log: log.next_log || null, days };
        if (newHealth <= 0) {
            payload.status = SESSION_STATUS.CLOSED;
            payload.end_time = timestamp();

            /** give health to every friends */
            await bluebird.all([
                UserService.bustProfileCache(session.user_id),
                NotificationService.sendLoseNotification(session.user_id)
            ]);

            /** notification */
            const [user, relations] = await Promise.all([
                UserService.getById(session.user_id),
                relationRepo.findAll({ challenger_id: session.user_id })
            ]);

            await bluebird.map(relations, (relation): any => UserService.addHealth(relation.user_id, user.username), {
                concurrency: 5
            });
        }

        const coordinate = parseCoordinate(log.coordinate);
        await Promise.all([
            logRepo.create({
                session_id: session.id,
                coordinate: { type: 'Point', coordinates: coordinate },
                status: LOG_STATUS.INVALID
            }),
            sessionRepo.update({ id: session.id }, payload)
        ]);
    }

    public static async avoided(session: Session, log: { coordinate: string; next_log: string }): Promise<void> {
        const sessionRepo = new SessionRepository();
        const logRepo = new LogRepository();

        const coordinate = parseCoordinate(log.coordinate);
        const days = Math.abs(moment(session.start_time).diff(moment(), 'days'));

        await Promise.all([
            sessionRepo.update({ id: session.id }, { days: days, next_log: log.next_log || null }),
            logRepo.create({
                session_id: session.id,
                coordinate: { type: 'Point', coordinates: coordinate },
                status: LOG_STATUS.VALID
            })
        ]);

        switch (days) {
            case 1: {
                await EmblemService.attach(session.user_id, EMBLEM_CODE.HERO_TWO);
                break;
            }
            case 7: {
                await EmblemService.attach(session.user_id, EMBLEM_CODE.WARRIOR_PANDEMI);
                break;
            }
            default:
                break;
        }

        await UserService.bustProfileCache(session.user_id);
    }
}
