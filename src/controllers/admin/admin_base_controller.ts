import BaseController from '../base/base_controller';
import AdminAuthController from './auth_controller';
import AdminDashboardController from './dashboard_controller';

export default class AdminBaseController extends BaseController {
    public setRoutes(): void {
        this.addChildController('/', new AdminAuthController());
        this.addChildController('/dashboard', new AdminDashboardController());
    }
}
