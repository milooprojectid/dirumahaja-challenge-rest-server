/// <reference types="../typings/express" />

import { Request, Response, NextFunction } from 'express';
import { HttpError, FirebaseContext } from 'tymon';
import { COMMON_ERRORS } from '../utils/constant';
import { IContext, IFirebaseToken } from 'src/typings/common';

const generateContext = (user: IFirebaseToken): IContext => ({
    user_id: user.uid,
    username: user.uid
});

export default async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const idToken = req.headers.Authorization;
    if (!idToken) {
        return next(HttpError.NotAuthorized(COMMON_ERRORS.TOKEN_INVALID));
    }

    const firebase = await FirebaseContext.getInstance();

    /** verify firebase id token */
    let user: IFirebaseToken;
    try {
        user = await firebase.auth().verifyIdToken(idToken);
    } catch (err) {
        throw HttpError.NotAuthorized('TOKEN_INVALID');
    }

    req.context = generateContext(user);
    return next();
};
