import { RegisterPayload } from 'src/typings/method';
import { Session, UserEmblem, Relation, User } from 'src/typings/models';
import { timestamp, parseCoordinate } from './helpers';
import { SESSION_STATUS, EMBLEM_CODE } from './constant';

export const userCreatePayload = ({ body: data }: RegisterPayload): Partial<User> => {
    const [lat, lng] = parseCoordinate(data.coordinate);

    return {
        id: data.uid,
        username: data.username,
        age: data.age,
        gender: data.gender,
        coordinate: { type: 'Point', coordinates: [lat, lng] },
        location_name: null
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
        is_active: true,
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

export const profileOutput = (user: User, emblem: UserEmblem, session: Session): any => {
    return {
        username: user.username,
        age: user.age,
        gender: user.gender,
        coordinate: `${user.coordinate.coordinates}`,
        location_name: user.location_name,
        session_day: session.days,
        session_health: session.health,
        session_status: session.status,
        session_punishment: session.punishment,
        emblem_img_url: emblem.emblem?.img_url,
        emblem_name: emblem.emblem?.name
    };
};

export const relationsOutput = (relations: Relation[]): any[] => {
    return relations.map((item): any => ({
        username: item.challenger?.username,
        location_name: item.challenger?.location_name,
        session_day: item.challenger?.active_session?.days,
        session_health: item.challenger?.active_session?.health,
        session_status: item.challenger?.active_session?.status,
        emblem_img_url: item.challenger?.active_emblem?.emblem?.img_url,
        emblem_name: item.challenger?.active_emblem?.emblem?.name
    }));
};
