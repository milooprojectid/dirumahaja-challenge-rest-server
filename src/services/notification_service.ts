import { sendToTopic } from '../utils/notification';
import NotificationRepository from '../repositories/notification_repo';
import UserService from './user_service';
import { User } from 'src/typings/models';

export default class NotificationService {
    public static async sendLoseNotification(userId: string): Promise<void> {
        const notifRepo = new NotificationRepository();
        const user = await UserService.getById(userId);

        const message = 'Yah.. Nyawa Kamu Telah Habis, Ayo pilih hukuman dan coba lagi';
        const icon = 'https://dirumahaja.miloo.id/assets/img/notification/notification_01.png';
        const action = '/punishment';

        await Promise.all([
            sendToTopic({
                notification: {
                    title: 'Kamu kalah :(',
                    body: message
                },
                data: {
                    screen: action,
                    click_action: 'FLUTTER_NOTIFICATION_CLICK',
                    icon: icon,
                    user_id: userId
                },
                topic: user.username
            }),
            notifRepo.create({
                user_id: userId,
                body: JSON.stringify({
                    text: message,
                    icon: icon,
                    button: 'Terima Hukuman',
                    action: action
                })
            })
        ]);
    }

    public static async sendWinNotification(userId: string, challengerId: string): Promise<void> {
        const notifRepo = new NotificationRepository();

        const [user, challenger] = await Promise.all([UserService.getById(userId), UserService.getById(challengerId)]);

        const message = `Yesss! Kamu menang Challenge melawan ${challenger.username}. Jangan lupa tagih hadiah mu`;
        const icon = 'https://dirumahaja.miloo.id/assets/img/notification/notification_02.png';

        await Promise.all([
            sendToTopic({
                notification: {
                    title: 'Kamu menang !',
                    body: message
                },
                data: {
                    screen: '/',
                    click_action: 'FLUTTER_NOTIFICATION_CLICK',
                    icon: icon,
                    user_id: userId
                },
                topic: user.username
            }),
            notifRepo.create({
                user_id: userId,
                body: JSON.stringify({
                    text: message,
                    icon: icon,
                    button: '',
                    action: ''
                })
            })
        ]);
    }

    public static async sendRelationNotification(challenger: User, origin: User): Promise<void> {
        const notifRepo = new NotificationRepository();

        const message = `${origin.username} menambahkan mu sebagai challenger`;
        const icon = 'https://dirumahaja.miloo.id/assets/img/notification/notification_02.png';

        await Promise.all([
            sendToTopic({
                notification: {
                    title: 'Challenger baru !',
                    body: message
                },
                data: {
                    screen: '/',
                    click_action: 'FLUTTER_NOTIFICATION_CLICK',
                    icon: icon,
                    user_id: challenger.username
                },
                topic: challenger.id
            }),
            notifRepo.create({
                user_id: challenger.id,
                body: JSON.stringify({
                    text: message,
                    icon: icon,
                    button: '',
                    action: ''
                })
            })
        ]);
    }
}
