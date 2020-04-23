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
        try {
            const userRepo = new UserRepository(context);
            const [totalUser, ageCounter, genderCounter, locationCounter] = await Promise.all([
                userRepo.count({}),
                userRepo.countAttribute('age'),
                userRepo.countAttribute('gender'),
                userRepo.countAttribute('location_name')
            ]);

            return {
                message: 'dashboard data retrieved',
                data: {
                    total_user: totalUser,
                    age: ageCounter,
                    gender: genderCounter,
                    location: locationCounter
                }
            };
        } catch (err) {
            if (err.status) throw err;
            throw HttpError.InternalServerError(err.message);
        }
    }

    public async map(data: IData, context: IContext): Promise<IHandlerOutput> {
        try {
            const userRepo = new UserRepository(context);

            const users = await userRepo.findAll({}, '-created_at', ['coordinate']);
            const points = users.map((user): number[] => [...user.coordinate.coordinates]);

            return {
                message: 'coordinates retrieved',
                data: points
            };
        } catch (err) {
            if (err.status) throw err;
            throw HttpError.InternalServerError(err.message);
        }
    }

    public setRoutes(): void {
        this.addRoute('get', '/', this.statistic);
        this.addRoute('get', '/map', this.map);
    }
}
