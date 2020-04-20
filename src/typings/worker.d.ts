import { Session, User } from './models';

export interface EmblemAttachedData {
    user_id: string;
    emblem_code: string;
}

export interface RelationAddedData {
    user_id: string;
}

export interface UserCheckedInData {
    session: Session;
    log: {
        coordinate: string;
        next_log: string;
    };
    lose: boolean;
}

export interface UserRegisteredData {
    user: User;
    challenger_id: string | null;
}
