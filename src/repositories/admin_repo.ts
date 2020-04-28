import SQLRepo from './base/sql_repository';
import { IContext } from 'src/typings/common';
import { Admin } from '../typings/models';

export default class AdminRepository extends SQLRepo<Admin> {
    public constructor(context?: IContext) {
        super('Admin', context);
    }
}
