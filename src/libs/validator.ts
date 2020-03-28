import * as Joi from '@hapi/joi';
import { HttpError } from 'tymon';
import { COMMON_ERRORS } from '../utils/constant';

const COOR_REGEX = /^([-+]?)([\d]{1,2})(((\.)(\d+)(,)))(\s*)(([-+]?)([\d]{1,3})((\.)(\d+))?)$/;

const schemas: { [s: string]: Joi.ObjectSchema } = {
    register: Joi.object({
        body: Joi.object({
            uid: Joi.string().required(),
            username: Joi.string().min(4).max(20).required(),
            age: Joi.number().integer().positive().optional(),
            gender: Joi.string().valid('m', 'f').optional(),
            coordinate: Joi.string().regex(COOR_REGEX).required(),
            challenger: Joi.string().max(255).optional()
        }).required()
    }),
    checkUsername: Joi.object({
        body: Joi.object({
            username: Joi.string().min(4).max(20).required()
        }).required()
    }),
    profile: Joi.object({
        query: Joi.object({
            cache: Joi.boolean().default(true)
        }).required()
    }),
    checkin: Joi.object({
        body: Joi.object({
            coordinate: Joi.string().regex(COOR_REGEX).required(),
            next_checkin: Joi.string().isoDate().allow('', null).optional()
        }).required()
    })
};

const defaultOptions: object = {
    stripUnknown: {
        arrays: false,
        objects: true
    },
    abortEarly: false
};

export default (input: object, schema: string, options: object = defaultOptions): any => {
    const scheme: Joi.ObjectSchema = schemas[schema];

    return Joi.validate(input, scheme, options).catch((err): void => {
        const details = err.details.reduce((detail: any, item: any): object => {
            detail[item.context.key] = item.message.replace(/"/g, '');
            return detail;
        }, {});
        throw HttpError.UnprocessableEntity('error validating fields', COMMON_ERRORS.VALIDATION_ERROR, details);
    });
};
