import Joi from 'joi';

const userCreateSchema = {
    firstName: Joi.string().min(2).max(255).required(),
    lastName: Joi.string().min(2).max(255).required(),
    birthDate: Joi.date().max(new Date()).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(64).required(),
}

const validateUserCreate = (data: { [key: string]: unknown }) => Joi.object(userCreateSchema).validate(data, { abortEarly: false })

export default {
    validateUserCreate,
};
