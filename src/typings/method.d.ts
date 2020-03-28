export interface RegisterPayload {
    body: {
        uid: string;
        username: string;
        age: number;
        gender: string;
        coordinate: string;
        challenger: string;
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
