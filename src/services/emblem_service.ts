import UserEmblemRepository from '../repositories/user_emblem_repo';
import Worker from '../jobs';
import { EmblemAttachedData } from 'src/typings/worker';
import { EMBLEM_CODE } from '../utils/constant';

export default class EmblemService {
    public static async attach(userId: string, emblemCode: EMBLEM_CODE, active: boolean = false): Promise<void> {
        const userEmblemRepo = new UserEmblemRepository();
        const payload = { user_id: userId, emblem_code: emblemCode };
        const emblem = await userEmblemRepo.findOne(payload);
        if (!emblem) {
            await Promise.all([
                userEmblemRepo.create({ is_active: active, ...payload }),
                Worker.dispatch<EmblemAttachedData>(Worker.Job.EMBLEM_ATTACHED, {
                    user_id: userId,
                    emblem_code: emblemCode
                })
            ]);
        }
    }
}
