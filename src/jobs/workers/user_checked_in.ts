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

        console.info(`checkin-data: ${JSON.stringify(data)}`);

        if (data.lose) {
            await SessionService.hitted(data.session, data.log);
        } else {
            await SessionService.avoided(data.session, data.log);
        }

        await DBContext.commit();
    } catch (err) {
        await DBContext.rollback();
        console.error(err.message);
    }
};
