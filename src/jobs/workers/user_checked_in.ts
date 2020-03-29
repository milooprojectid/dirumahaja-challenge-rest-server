import { Session } from 'src/typings/models';
import { DBContext } from 'tymon';
import SessionService from '../../services/session_service';

interface Data {
    session: Session;
    log: {
        coordinate: string;
        next_log: string;
    };
    lose: boolean;
}

export default async ({ data }: { data: Data }): Promise<void> => {
    try {
        await DBContext.startTransaction();

        if (data.lose) {
            await SessionService.hitted(data.session, data.log);
        } else {
            await SessionService.avoided(data.session, data.log);
        }

        console.info(`${data.session.user_id} is ${data.lose}`);

        await DBContext.commit();
    } catch (err) {
        await DBContext.rollback();
        console.error(err.message);
    }
};
