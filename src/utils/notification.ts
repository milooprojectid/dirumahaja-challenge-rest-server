import { INotificationPayload } from 'src/typings/common';
import { FirebaseContext } from 'tymon';

export const sendToTopic = async (payload: INotificationPayload): Promise<void> => {
    const messager = await FirebaseContext.getInstance().messaging();
    await messager.send(payload);
};
