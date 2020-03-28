import { HttpError } from 'tymon';
import SessionRepository from '../repositories/session_repo';
import { SESSION_STATUS } from '../utils/constant';
import { initSessionPayload } from '../utils/transformer';
import { Session } from 'src/typings/models';

export default class SessionService {
    public static async initializeNewSession(userId: string): Promise<void> {
        try {
            const sessionRepo = new SessionRepository();
            await sessionRepo.update({ user_id: userId }, { status: SESSION_STATUS.CLOSED });

            const payload = initSessionPayload(userId);
            await sessionRepo.create(payload);
        } catch (err) {
            throw HttpError.InternalServerError(`fail generating new session, ${err.message}`);
        }
    }

    public static async getActiveSession(userId: string): Promise<Session> {
        try {
            const sessionRepo = new SessionRepository();
            const session = await sessionRepo.findOne({ user_id: userId, status: SESSION_STATUS.ON_GOING });
            if (!session) {
                throw HttpError.NotFound('not active session found');
            }
            return session;
        } catch (err) {
            throw HttpError.InternalServerError(`fail generating new session, ${err.message}`, 'SESSION_ERROR');
        }
    }
}
