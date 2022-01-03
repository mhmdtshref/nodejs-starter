import { UserStatus } from '@types';
import Joi from 'joi';

const userCreateSchema = {
    firstName: Joi.string().min(2).max(255).required(),
    lastName: Joi.string().min(2).max(255).required(),
    birthDate: Joi.date().max(new Date()).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(64).required(),
    status: Joi.string().valid(...Object.values(UserStatus)),
}

/**
 * @memberof UserValidators
 * @name validateUserCreate
 * @description Validates create-user data using user create schema (format and props)
 * @param {Object} data User data
 * @returns {Joi.ValidationResult<any>} Validation results object
 */
const validateUserCreate = (data: { [key: string]: unknown }) => Joi.object(userCreateSchema).validate(data, { abortEarly: false })

export default {
    validateUserCreate,
};
