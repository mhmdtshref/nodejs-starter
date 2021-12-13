import Joi from "joi";

const loginSchema = {
    email: Joi.string().required(),
    password: Joi.string().required(),
};

const validateLoginData = (data: { [key: string]: unknown }) => Joi.object(loginSchema).validate(data);

export default {
    validateLoginData,
};
