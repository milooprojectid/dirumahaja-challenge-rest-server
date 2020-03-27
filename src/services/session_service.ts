import { HttpError } from 'tymon';
import SessionRepository from '../repositories/session_repo';
import { SESSION_STATUS } from '../utils/constant';
import { initSessionPayload } from '../utils/transformer';

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
}
