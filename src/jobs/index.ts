import * as Queue from 'bull';

import UserCheckedId from './workers/user_checked_in';
import EmblemAttached from './workers/emblem_attached';

let instance: { [s: string]: Queue.Queue };

export enum Job {
    USER_CHECKIN = 'user-checked-in',
    EMBLEM_ATTACHED = 'emblem-attached'
}

export const initialize = async ({ connection_string }: { connection_string: string }): Promise<void> => {
    const userCheckedInQueue = new Queue(Job.USER_CHECKIN, connection_string);
    userCheckedInQueue.process(UserCheckedId);

    const emblemAttachedQueue = new Queue(Job.EMBLEM_ATTACHED, connection_string);
    emblemAttachedQueue.process(EmblemAttached);

    instance = {
        [Job.USER_CHECKIN]: userCheckedInQueue,
        [Job.EMBLEM_ATTACHED]: emblemAttachedQueue
    };
};

export const dispatch = async (job: Job, data?: any): Promise<void> => {
    if (!instance) {
        throw new Error('Job not initialized');
    }
    await instance[job].add(data);
};

export default {
    Job,
    initialize,
    dispatch
};
