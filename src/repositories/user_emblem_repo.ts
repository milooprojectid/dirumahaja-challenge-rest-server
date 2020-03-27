import SQLRepo from './base/sql_repository';
import { IContext } from 'src/typings/common';
import { UserEmblem } from '../typings/models';

export default class UserRepository extends SQLRepo<UserEmblem> {
    public constructor(context?: IContext) {
        super('UserEmblem', context);
    }
}
