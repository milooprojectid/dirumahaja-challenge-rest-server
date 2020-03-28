import SQLRepo from './base/sql_repository';
import { IContext } from 'src/typings/common';
import { Relation } from '../typings/models';
import { SESSION_STATUS } from '../utils/constant';

export default class UserRepository extends SQLRepo<Relation> {
    public constructor(context?: IContext) {
        super('Relation', context);
    }

    public async getDetailedRelations(userId: string): Promise<any[]> {
        const db = await this.getDbInstance();
        // const order = sorter(sort);

        return db[this.model].findAll({
            where: {
                user_id: userId
            },
            include: {
                model: db.User,
                as: 'challenger',
                include: [
                    {
                        model: db.Session,
                        required: true,
                        as: 'active_session',
                        where: { status: SESSION_STATUS.ON_GOING }
                    },
                    {
                        model: db.UserEmblem,
                        required: true,
                        as: 'active_emblem',
                        include: {
                            required: true,
                            model: db.Emblem,
                            as: 'emblem',
                            attributes: ['code', 'name', 'img_url']
                        },
                        where: { is_active: true }
                    }
                ]
            }
            // order: [order]
        });
    }
}
