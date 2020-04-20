import UserEmblemRepository from '../../repositories/user_emblem_repo';
import { EMBLEM_CODE } from '../../utils/constant';
import { EmblemAttachedData } from 'src/typings/worker';

export default async ({ data }: { data: EmblemAttachedData }): Promise<void> => {
    try {
        const userEmblemRepo = new UserEmblemRepository();
        if (data.emblem_code != EMBLEM_CODE.CORONA_HERO) {
            const totalEmblem = await userEmblemRepo.count({ user_id: data.user_id });
            if (totalEmblem >= 7) {
                const payload = { user_id: data.user_id, code: EMBLEM_CODE.CORONA_HERO };
                await Promise.all([
                    userEmblemRepo.upsert(payload, payload)
                    // NotificationService
                ]);
            }
        }
    } catch (err) {
        console.error(err.message);
    }
};
