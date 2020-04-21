import { sendToFcm } from '../utils/notification';
import NotificationRepository from '../repositories/notification_repo';
import UserService from './user_service';
import { User } from 'src/typings/models';
import { Covid19Data } from 'src/typings/common';
import { EMBLEM_CODE, ICON } from 'src/utils/constant';
import EmblemRepository from 'src/repositories/emblem_repo';

export default class NotificationService {
    public static async sendLoseNotification(userId: string): Promise<void> {
        const notifRepo = new NotificationRepository();
        const user = await UserService.getById(userId);

        const message = 'Yah.. Nyawa Kamu Telah Habis, Ayo pilih hukuman dan coba lagi';
        const icon = ICON.SAD;
        const action = '/punishment';

        const payload = {
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
            topic: user.id
        };

        await Promise.all([
            sendToFcm(payload),
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
        const icon = ICON.HAPPY;

        const payload = {
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
            topic: user.id
        };

        await Promise.all([
            sendToFcm(payload),
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
        const icon = ICON.HAPPY;

        const payload = {
            notification: {
                title: 'Challenger baru !',
                body: message
            },
            data: {
                screen: '/',
                click_action: 'FLUTTER_NOTIFICATION_CLICK',
                icon: icon,
                user_id: challenger.id
            },
            topic: challenger.id
        };

        await Promise.all([
            sendToFcm(payload),
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

    public static async sendEmblemNotification(userId: string, code: EMBLEM_CODE): Promise<void> {
        const notifRepo = new NotificationRepository();
        const emblemRepo = new EmblemRepository();

        const emblem = await emblemRepo.findOne({ code: code });
        const message = `yaay kamu mendapatkan emblem ${emblem?.name}`;
        const icon = emblem?.img_url || ICON.HAPPY;

        const payload = {
            notification: {
                title: 'Emblem baru !',
                body: message
            },
            data: {
                screen: '/',
                click_action: 'FLUTTER_NOTIFICATION_CLICK',
                icon: icon,
                user_id: userId
            },
            topic: userId
        };

        await Promise.all([
            sendToFcm(payload),
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

    public static async sendCovidNotification(data: Covid19Data, topic: string = 'all'): Promise<void> {
        await sendToFcm({
            notification: {
                title: 'Update corona',
                body: `Kasus positif corona di indonesia kini ${data.confirmed}`
            },
            data: {
                screen: '/',
                click_action: 'FLUTTER_NOTIFICATION_CLICK'
            },
            topic
        });
    }
}
