export interface RegisterPayload {
    body: {
        uid?: string;
        id_token: string;
        username: string;
        age: number;
        gender: string;
        coordinate: string;
        challenger: string;
        location_name: string;
        phone?: string;
        email?: string;
        name?: string;
    };
}

export interface GetProfilePayload {
    query: {
        cache: boolean;
    };
}

export interface CheckinPayload {
    body: {
        coordinate: string;
        next_checkin: string;
    };
}

export interface SetSessionPunishmentPayload {
    body: {
        punishment: string;
    };
}
