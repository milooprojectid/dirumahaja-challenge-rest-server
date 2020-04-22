import { HttpError } from 'tymon';

import BaseController from '../base/base_controller';
import { IData, IContext, IHandlerOutput } from 'src/typings/common';
import AuthMiddleware from '../../middlewares/auth';
import UserRepository from '../../repositories/user_repo';

export default class AdminDashboardController extends BaseController {
    public constructor() {
        super();
        this.setMiddleware(AuthMiddleware);
    }

    public async statistic(data: IData, context: IContext): Promise<IHandlerOutput> {
        const userRepo = new UserRepository(context);

        const [totalUser, ageCounter, genderCounter, locationCounter] = await Promise.all([
            userRepo.count({}),
            userRepo.countAttribute('age'),
            userRepo.countAttribute('gender'),
            userRepo.countAttribute('location_name')
        ]);

        return {
            message: 'dashboard data retrueved',
            data: {
                total_user: totalUser,
                age: ageCounter,
                gender: genderCounter,
                location: locationCounter
            }
        };
    }

    public setRoutes(): void {
        this.addRoute('get', '/', this.statistic);
    }
}
