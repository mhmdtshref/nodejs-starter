import { AuthMethod } from '@src/types';
import Joi, { ValidationOptions } from 'joi';

const userCreateByOAuth2Schema = {
    firstName: Joi.string().min(2).max(255).required(),
    lastName: Joi.string().min(2).max(255).required(),
    birthDate: Joi.date().max(new Date()),
    email: Joi.string().email().required(),
    providerUserId: Joi.string().min(1),
}

const userCreateByPasswordSchema = {
    firstName: Joi.string().min(2).max(255).required(),
    lastName: Joi.string().min(2).max(255).required(),
    birthDate: Joi.date().max(new Date()).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(64).required(),
}

/**
 * @memberof UserValidators
 * @name validateUserCreate
 * @description Validates create-user data using user create schema (format and props)
 * @param {Object} data User data
 * @param {AuthMethod} method Authentication method
 * @returns {Joi.ValidationResult<any>} Validation results object
 */
const validateUserCreate = (data: { [key: string]: any }, method: AuthMethod) => {
    const validateOptions: ValidationOptions = { abortEarly: false };
    switch (method) {
        case AuthMethod.Password:
            return Joi.object(userCreateByPasswordSchema).validate(data, validateOptions);
        case AuthMethod.OAuth2:
            return Joi.object(userCreateByOAuth2Schema).validate(data, validateOptions);
        default:
            throw new Error('Validation error: method value is not in any case');
    }
}

export default {
    validateUserCreate,
};
