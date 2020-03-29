import UserEmblemRepository from '../../repositories/user_emblem_repo';
import { EMBLEM_CODE } from '../../utils/constant';

interface Data {
    user_id: string;
    emblem_code: string;
}

export default async ({ data }: { data: Data }): Promise<void> => {
    try {
        const userEmblemRepo = new UserEmblemRepository();
        if (data.emblem_code != EMBLEM_CODE.CORONA_HERO) {
            const totalEmblem = await userEmblemRepo.count({ user_id: data.user_id });
            if (totalEmblem >= 7) {
                const payload = { user_id: data.user_id, code: EMBLEM_CODE.CORONA_HERO };
                await userEmblemRepo.upsert(payload, payload);
            }
        }
    } catch (err) {
        console.error(err.message);
    }
};
