import { Router } from 'express';

declare module '*.json' {
    const value: any;
    export default value;
}

declare function require(name: string): any;

export interface IObject {
    [s: string]: any;
}

export interface IPagination {
    page: number;
    per_page: number;
    total_page: number;
    total_data: number;
}

export interface IContext {
    username: string;
    user_id: string;
}

export interface IData<Query = any, Params = any, Body = any> {
    query: Query;
    params: Params;
    body: Body;
}

export interface IHandlerOutput {
    message?: string;
    data?: any;
    status?: number;
    pagination?: IPagination;
}

export type methodHandler = (data: IData, context: IContext) => Promise<IHandlerOutput>;

export interface IHttpError {
    message: string;
    name: string;
    status: number;
    data?: object;
}

export interface IHttpOutput {
    data?: any;
    meta: {
        code: number;
        user_message?: string;
        error_message?: string | null;
        error_type?: string;
        error_data?: any;
        stack?: any[];
    };
    pagination?: IPagination;
}

export type MakeAny<T> = {
    [P in keyof T]?: any;
};

export declare type Complete<T> = {
    [K in keyof T]-?: T[K];
};

export interface INotificationPayload {
    notification?: {
        title: string;
        body?: string;
    };
    data?: { [s: string]: string };
    topic: string;
}

export interface IFirebaseToken {
    uid: string;
    phone_number: string | undefined;
    email: string | undefined;
    iss: string;
    aud: string;
    sub: string;
    iat: number;
    exp: number;
}
