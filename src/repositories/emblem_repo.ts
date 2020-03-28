import SQLRepo from './base/sql_repository';
import { IContext } from 'src/typings/common';
import { Emblem } from '../typings/models';

export default class EmblemRepository extends SQLRepo<Emblem> {
    public constructor(context?: IContext) {
        super('Emblem', context);
    }
}
