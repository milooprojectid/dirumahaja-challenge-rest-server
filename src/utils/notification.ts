import { INotificationPayload } from 'src/typings/common';
import { FirebaseContext } from 'tymon';

export const sendToFcm = async (payload: INotificationPayload): Promise<void> => {
    const messager = await FirebaseContext.getInstance().messaging();
    await messager.send(payload);
};
