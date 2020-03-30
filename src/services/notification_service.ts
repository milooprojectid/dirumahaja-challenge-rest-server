import { sendToTopic } from '../utils/notification';
import NotificationRepository from '../repositories/notification_repo';

export default class NotificationService {
    public static async sendLoseNotification(userId: string): Promise<void> {
        const notifRepo = new NotificationRepository();

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
                topic: userId
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

    public static async sendHealthNotification(userId: string, from: string): Promise<void> {
        const notifRepo = new NotificationRepository();

        const message = `Yesss! Kamu menang Challenge melawan ${from}. Jangan lupa tagih hadiah mu`;
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
                topic: userId
            }),
            notifRepo.create({
                user_id: userId,
                body: JSON.stringify({
                    text: message,
                    icon: icon,
                    button: null,
                    action: null
                })
            })
        ]);
    }
}
