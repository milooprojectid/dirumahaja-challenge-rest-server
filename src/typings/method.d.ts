export interface Registerpayload {
    body: {
        uid: string;
        username: string;
        age: number;
        gender: string;
        coordinate: string;
        challenger: string;
    };
}
