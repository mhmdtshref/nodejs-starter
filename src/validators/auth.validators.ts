import { AuthMethod, OAuth2Provider } from "@types";
import Joi from "joi";

const loginSchema = {
    method: Joi.string().required().valid(...Object.values(AuthMethod)),
    provider: Joi.alternatives().conditional('method', { is: AuthMethod.OAuth2, then: Joi.string().required().valid(...Object.values(OAuth2Provider)) }),
    credentials: Joi.alternatives().conditional(
        'method',
        [
            {
                is: AuthMethod.OAuth2,
                then: Joi.object({
                    code: Joi.string().required(),
                })
            },
            {
                is: AuthMethod.Password,
                then: Joi.object({
                    email: Joi.string().required(),
                    password: Joi.string().required(),
                })
            }
        ],
    ),
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
