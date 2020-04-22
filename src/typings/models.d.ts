export interface Model {
    id: string;
    created_at: string;
    updated_at: string;
    deleted_at: string;
}

export interface Coordinate {
    type: string;
    coordinates: number[];
}

export interface User extends Model {
    name: string;
    phone: string;
    email: string;
    username: string;
    age: number | null;
    gender: string | null;
    coordinate: Coordinate;
    location_name: string | null;

    active_session?: Session;
    active_emblem?: UserEmblem;
}

export interface Session extends Model {
    user_id: string;
    health: number;
    status: number;
    days: number;
    is_active: boolean;
    start_time: string;
    end_time: string | null;
    next_log: string | null;
    punishment: string | null;

    user?: User;
}

export interface Log extends Model {
    session_id: string;
    coordinate: Coordinate;
    status: number;

    session?: Session;
}

export interface Relation extends Model {
    user_id: string;
    challenger_id: string;

    challenger?: User;
}

export interface UserEmblem extends Model {
    user_id: string;
    emblem_code: string;
    is_active: boolean;

    emblem?: Emblem;
}

export interface Emblem extends Model {
    code: string;
    name: string;
    img_url: string;
}

export interface Notification extends Model {
    user_id: string;
    body: string;
}

export interface Punishment extends Model {
    name: string;
    text: string;
    img_url: string;
}

export interface Admin extends Model {
    name: string;
    email: string;
    username: string;
    password: string;
    refresh_token: string;
}
