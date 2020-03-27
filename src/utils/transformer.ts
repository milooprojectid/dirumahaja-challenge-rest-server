import { Registerpayload } from 'src/typings/method';
import { Session, UserEmblem, Relation } from 'src/typings/models';
import { timestamp } from './helpers';
import { SESSION_STATUS, EMBLEM_CODE } from './constant';

export const userCreatePayload = ({ body: data }: Registerpayload): any => {
    const [lat, lng] = data.coordinate.split(',').map((item: string): number => +item.trim());

    return {
        id: data.uid,
        username: data.username,
        age: data.age,
        gender: data.gender,
        coordinate: { type: 'Point', coordinates: [lat, lng] }
    };
};

export const userEmblemCreatePayload = (
    userId: string,
    code: string = EMBLEM_CODE.HERO_ONE,
    status: boolean = true
): Partial<UserEmblem> => {
    return {
        user_id: userId,
        emblem_code: code,
        is_active: status
    };
};

export const initSessionPayload = (userId: string): Partial<Session> => {
    return {
        user_id: userId,
        days: 0,
        health: 1,
        start_time: timestamp(),
        end_time: null,
        next_log: null,
        status: SESSION_STATUS.ON_GOING,
        punishment: null
    };
};

export const relationCreatepayload = (userId: string, challengerId: string): Partial<Relation> => {
    return {
        user_id: userId,
        challenger_id: challengerId
    };
};
