import SQLRepo from './base/sql_repository';
import { IContext } from 'src/typings/common';
import { Punishment } from '../typings/models';

export default class PunishmentRepository extends SQLRepo<Punishment> {
    public constructor(context?: IContext) {
        super('Punishment', context);
    }
}
