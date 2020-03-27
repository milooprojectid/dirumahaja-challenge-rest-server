import SQLRepo from './base/sql_repository';
import { IContext } from 'src/typings/common';
import { Emblem } from '../typings/models';

export default class UserRepository extends SQLRepo<Emblem> {
    public constructor(context?: IContext) {
        super('Emblem', context);
    }
}
