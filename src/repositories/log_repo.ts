import SQLRepo from './base/sql_repository';
import { IContext } from 'src/typings/common';
import { Log } from '../typings/models';

export default class LogRepository extends SQLRepo<Log> {
    public constructor(context?: IContext) {
        super('Log', context);
    }

    public async getAllUserLogs(userId: string): Promise<Log[]> {
        const db = await this.getDbInstance();
        return db[this.model].findAll({
            include: [
                {
                    model: db.Session,
                    required: true,
                    as: 'session',
                    include: [
                        { model: db.User, required: true, as: 'user', where: { id: userId }, attributes: ['id'] }
                    ],
                    attributes: ['id']
                }
            ],
            attributes: ['id', 'coordinate', 'created_at']
        });
    }
}
