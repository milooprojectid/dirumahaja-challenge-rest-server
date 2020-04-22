import { HttpError, DBContext } from 'tymon';

import BaseController from '../base/base_controller';
import { IData, IContext, IHandlerOutput } from 'src/typings/common';
import AuthMiddleware from '../../middlewares/auth';
import UserRepository from '../../repositories/user_repo';
import Validator from '../../middlewares/request_validator';
import { userListOutput } from '../../utils/transformer';

const filterUsers = async (name: string): Promise<any> => {
    const db = await DBContext.getInstance();
    const { Op } = db.ORMProvider;

    let query;
    if (name) {
        query = {
            [Op.or]: [
                { name: { [Op.like]: `%${name}%` } },
                { username: { [Op.like]: `%${name}%` } },
                { email: { [Op.like]: `%${name}%` } },
                { phone: { [Op.like]: `%${name}%` } }
            ]
        };
    }

    return query;
};

export default class AdminUserController extends BaseController {
    public constructor() {
        super();
        this.setMiddleware(AuthMiddleware);
    }

    public async userList(data: IData, context: IContext): Promise<IHandlerOutput> {
        const { query } = data;
        const userRepo = new UserRepository(context);

        const filter = await filterUsers(query.name);
        const users = await userRepo.paginate(filter, { page: query.page, per_page: query.per_page, sort: query.sort });

        return {
            message: 'dashboard data retrieved',
            data: {
                users: userListOutput(users.data),
                pagination: users.meta
            }
        };
    }

    public setRoutes(): void {
        this.addRoute('get', '/', this.userList, Validator('userList'));
    }
}
