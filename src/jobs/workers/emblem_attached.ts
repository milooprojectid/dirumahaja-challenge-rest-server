import UserEmblemRepository from '../../repositories/user_emblem_repo';
import { EMBLEM_CODE } from '../../utils/constant';
import { EmblemAttachedData } from 'src/typings/worker';
import EmblemService from '../../services/emblem_service';
import NotificationService from 'src/services/notification_service';

export default async ({ data }: { data: EmblemAttachedData }): Promise<void> => {
    try {
        const userEmblemRepo = new UserEmblemRepository();
        if (data.emblem_code !== EMBLEM_CODE.CORONA_HERO) {
            const totalEmblem = await userEmblemRepo.count({ user_id: data.user_id });
            if (totalEmblem === 7) {
                await EmblemService.attach(data.user_id, EMBLEM_CODE.CORONA_HERO);
            }
        }
        await NotificationService.sendEmblemNotification(data.user_id, data.emblem_code);
    } catch (err) {
        console.error(err.message);
    }
};
