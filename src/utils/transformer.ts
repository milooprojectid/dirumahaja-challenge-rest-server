import { RegisterPayload } from 'src/typings/method';
import { Session, UserEmblem, Relation, User, Log } from 'src/typings/models';
import { timestamp, parseCoordinate } from './helpers';
import { SESSION_STATUS, EMBLEM_CODE } from './constant';

export const userCreatePayload = (
    { body: data }: RegisterPayload,
    optional?: { name: string; phone: string; email: string }
): Partial<User> => {
    const [lat, lng] = parseCoordinate(data.coordinate);

    return {
        uid: data.uid,
        name: optional?.name || null,
        phone: optional?.phone || null,
        email: optional?.email || null,
        username: data.username,
        age: data.age,
        gender: data.gender,
        coordinate: { type: 'Point', coordinates: [lat, lng] },
        location_name: data.location_name || null
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

export const logListOutput = (logs: Log[]): Partial<Log>[] => {
    return logs.map((log): any => ({
        id: log.id,
        session_id: log.session_id,
        coordinate: log.coordinate,
        status: log.status,
        created_at: log.created_at
    }));
};

export const userListOutput = (users: User[]): Partial<User>[] => {
    return users.map((user): any => ({
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        age: user.age
    }));
};

export const userDetailOutput = (user: User, logs: Log[], relations: Relation[]): any => {
    return {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        age: user.age,
        coordinate: [...user.coordinate.coordinates],
        location_name: user.location_name,
        logs: logs.map((log): any => ({
            id: log.id,
            coordinate: [...log.coordinate.coordinates],
            created_at: log.created_at
        })),
        relations: relations.map((relation): any => ({
            id: relation.challenger?.id,
            name: relation.challenger?.name,
            username: relation.challenger?.username
        })),
        created_at: user.created_at
    };
};
