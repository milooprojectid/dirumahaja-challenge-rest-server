import SQLRepo from './base/sql_repository';
import { IContext } from 'src/typings/common';
import { User } from '../typings/models';

export default class UserRepository extends SQLRepo<User> {
    public constructor(context?: IContext) {
        super('User', context);
    }

    public async countAttribute(attribute: string): Promise<number> {
        const db = await this.getDbInstance();
        return await db[this.model].count({
            group: [attribute],
            attributes: [attribute]
        });
    }
}
