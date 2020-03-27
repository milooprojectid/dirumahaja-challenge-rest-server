import SQLRepo from './base/sql_repository';
import { IContext } from 'src/typings/common';
import { Relation } from '../typings/models';

export default class UserRepository extends SQLRepo<Relation> {
    public constructor(context?: IContext) {
        super('Relation', context);
    }
}
