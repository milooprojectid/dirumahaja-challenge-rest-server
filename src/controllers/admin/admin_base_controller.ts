import BaseController from '../base/base_controller';
import AdminAuthController from './auth_controller';

export default class AdminBaseController extends BaseController {
    public setRoutes(): void {
        this.addChildController('/', new AdminAuthController());
    }
}
