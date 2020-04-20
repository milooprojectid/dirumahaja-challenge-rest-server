import * as Queue from 'bull';

import UserCheckedId from './workers/user_checked_in';
import EmblemAttached from './workers/emblem_attached';
import RelationAdded from './workers/relation_added';
import UserRegistered from './workers/user_registered';

let instance: { [s: string]: Queue.Queue };

export enum Job {
    USER_CHECKIN = 'user-checked-in',
    USER_REGISTERED = 'user-registered',
    EMBLEM_ATTACHED = 'emblem-attached',
    RELATION_ADDED = 'relation-added'
}

export const initialize = async ({ connection_string }: { connection_string: string }): Promise<void> => {
    const userCheckedInQueue = new Queue(Job.USER_CHECKIN, connection_string);
    userCheckedInQueue.process(UserCheckedId);

    const emblemAttachedQueue = new Queue(Job.EMBLEM_ATTACHED, connection_string);
    emblemAttachedQueue.process(EmblemAttached);

    const relationAddedQueue = new Queue(Job.RELATION_ADDED, connection_string);
    relationAddedQueue.process(RelationAdded);

    const userRegisteredQueue = new Queue(Job.USER_REGISTERED, connection_string);
    userRegisteredQueue.process(UserRegistered);

    instance = {
        [Job.USER_CHECKIN]: userCheckedInQueue,
        [Job.EMBLEM_ATTACHED]: emblemAttachedQueue,
        [Job.RELATION_ADDED]: relationAddedQueue,
        [Job.USER_REGISTERED]: userRegisteredQueue
    };
};

export const dispatch = async <Data = any>(job: Job, data: Data): Promise<void> => {
    if (!instance) {
        throw new Error('Job not initialized');
    }
    await instance[job].add(data);
    console.info(`${job} dispatched`);
};

export default {
    Job,
    initialize,
    dispatch
};
