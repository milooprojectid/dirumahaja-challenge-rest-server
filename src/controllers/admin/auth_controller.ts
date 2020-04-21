import BaseController from '../base/base_controller';
import { IData, IContext, IHandlerOutput } from 'src/typings/common';

export default class AdminAuthController extends BaseController {
    public async login(data: IData, context: IContext): Promise<IHandlerOutput> {
        return {
            message: 'auth success',
            data: null
        };
    }

    public setRoutes(): void {
        this.addRoute('post', '/auth', this.login);
    }
}
