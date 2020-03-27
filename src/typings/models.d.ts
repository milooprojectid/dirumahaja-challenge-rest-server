export interface Model {
    id: string;
    created_at: string;
    updated_at: string;
    deleted_at: string;
}

export interface User extends Model {
    username: string;
    age: number;
    gender: string;
    coordinate: string;
}

export interface Session extends Model {
    user_id: string;
    health: number;
    status: number;
    days: number;
    start_time: string;
    end_time: string;
    next_log: string;
    punishment: string;
}

export interface Log extends Model {
    session_id: string;
    coordinate: string;
    status: number;
}

export interface Relation extends Model {
    user_id: string;
    challenger_id: string;
}

export interface UserEmblem extends Model {
    user_id: string;
    emblem_code: string;
    is_active: boolean;
}

export interface Emblem extends Model {
    code: string;
    name: string;
    img_url: string;
}
