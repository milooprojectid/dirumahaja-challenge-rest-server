import { HttpError, DBContext } from 'tymon';

import BaseController from '../base/base_controller';
import { IData, IContext, IHandlerOutput } from 'src/typings/common';
import AuthMiddleware from '../../middlewares/auth';
import UserRepository from '../../repositories/user_repo';
import Validator from '../../middlewares/request_validator';
import { userListOutput, userDetailOutput } from '../../utils/transformer';
import LogRepository from '../../repositories/log_repo';

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
            message: 'user list retrieved',
            data: {
                users: userListOutput(users.data),
                pagination: users.meta
            }
        };
    }

    public async userDetail(data: IData, context: IContext): Promise<IHandlerOutput> {
        const { params } = data;
        const userRepo = new UserRepository(context);
        const logRepo = new LogRepository(context);

        const user = await userRepo.findOne({ id: params.id });
        if (!user) {
            throw HttpError.NotFound('USER_NOT_FOUND');
        }

        const logs = await logRepo.getAllUserLogs(user.id);

        return {
            message: 'user detail retrieved',
            data: userDetailOutput(user, logs)
        };
    }

    public setRoutes(): void {
        this.addRoute('get', '/', this.userList, Validator('userList'));
        this.addRoute('get', '/:id', this.userDetail);
    }
}
