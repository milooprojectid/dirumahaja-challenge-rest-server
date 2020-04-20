import UserEmblemRepository from '../repositories/user_emblem_repo';
import Worker from '../jobs';
import { EmblemAttachedData } from 'src/typings/worker';

export default class EmblemService {
    public static async attach(userId: string, emblemCode: string, active: boolean = false): Promise<void> {
        const userEmblemRepo = new UserEmblemRepository();
        const payload = { user_id: userId, emblem_code: emblemCode };

        await userEmblemRepo.upsert(payload, { ...payload, is_active: active });

        await Worker.dispatch<EmblemAttachedData>(Worker.Job.EMBLEM_ATTACHED, {
            user_id: userId,
            emblem_code: emblemCode
        });
    }
}
