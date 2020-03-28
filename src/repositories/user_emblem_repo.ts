import SQLRepo from './base/sql_repository';
import { IContext } from 'src/typings/common';
import { UserEmblem } from '../typings/models';

export default class UserRepository extends SQLRepo<UserEmblem> {
    public constructor(context?: IContext) {
        super('UserEmblem', context);
    }

    public async getActiveEmblem(userId: string): Promise<UserEmblem> {
        const db = await this.getDbInstance();
        return db[this.model].findOne({
            where: {
                user_id: userId,
                is_active: true
            },
            include: [
                {
                    model: db.Emblem,
                    as: 'emblem',
                    attributes: ['code', 'name', 'img_url']
                }
            ],
            attributes: ['id']
        });
    }
}
