/// <reference types="../typings/express" />

import { Request, Response, NextFunction } from 'express';
import { HttpError } from 'tymon';
import { COMMON_ERRORS } from '../utils/constant';
import { IContext } from 'src/typings/common';

const generateContext = (uid: string): IContext => ({
    user_id: uid,
    username: ''
});

export default (req: Request, res: Response, next: NextFunction): void => {
    const uid = req.query.uid || req.headers.uid;
    if (!uid) {
        return next(HttpError.NotAuthorized(COMMON_ERRORS.TOKEN_INVALID));
    }
    req.context = generateContext(uid);
    return next();
};
