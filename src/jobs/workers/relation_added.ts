import RelationRepository from '../../repositories/relation_repo';
import Worker from '../';
import EmblemService from '../../services/emblem_service';
import { EMBLEM_CODE } from '../../utils/constant';

interface Data {
    user_id: string;
}

export default async ({ data }: { data: Data }): Promise<void> => {
    try {
        const relationRepo = new RelationRepository();
        const totalRelation = await relationRepo.count({ user_id: data.user_id });

        const newTotalRelation = totalRelation + 1;
        switch (newTotalRelation) {
            case 5: {
                await EmblemService.attach(data.user_id, EMBLEM_CODE.AQUA_VIRUS);
                break;
            }

            case 10: {
                await EmblemService.attach(data.user_id, EMBLEM_CODE.INFLUENCER);
                break;
            }

            default:
                break;
        }
    } catch (err) {
        console.error(err.message);
    }
};
