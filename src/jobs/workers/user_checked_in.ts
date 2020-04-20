import { DBContext } from 'tymon';
import SessionService from '../../services/session_service';
import { UserCheckedInData } from 'src/typings/worker';

export default async ({ data }: { data: UserCheckedInData }): Promise<void> => {
    try {
        await DBContext.startTransaction();

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
