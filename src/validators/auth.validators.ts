import Joi from "joi";

const loginSchema = {
    email: Joi.string().required(),
    password: Joi.string().required(),
};

/**
 * @memberof AuthValidators
 * @name validateLoginData
 * @description Validates login data using login schema (format and props)
 * @param {Object} data Login data
 * @returns {Joi.ValidationResult<any>} Validation results object
 */
const validateLoginData = (data: { [key: string]: unknown }) => Joi.object(loginSchema).validate(data);

export default {
    validateLoginData,
};
