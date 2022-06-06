import { MailingServiceProviders, OAuth2Provider } from "@types";
import Joi from "joi";

const serverEnvironmentsSchema = {
    host: Joi.string().hostname().required(),
    port: Joi.number().port().required(),
    whitelistOrigins: Joi.array().min(0).items(Joi.string().uri()),
};

const databaseEnvironmentsSchema = {
    host: Joi.string().hostname(),
    port: Joi.number().port().required(),
    username: Joi.string().required(),
    password: Joi.string().required(),
    database: Joi.string().required(),
    logging: Joi.boolean().required(),
    dialect: Joi.string().required(),
};

const authEnvironmentsSchema = {
    userTokenSecret: Joi.string().token(),
    verifyUserUrlPath: Joi.string(),
    frontendDomain: Joi.string().uri(),
    mathods: Joi.object({
        oauth2: Joi.object({
            redirectUrl: Joi.string().uri(),
            providers: Joi.object().pattern(Joi.string().valid(...Object.values(OAuth2Provider)), Joi.object({
                clientId: Joi.string(),
                clientSecret: Joi.string(),
            })),
        }),
    }),
};

const mailingEnvironmentSchema: Joi.PartialSchemaMap = {
    providers: Joi.object().pattern(Joi.string().valid(...Object.values(MailingServiceProviders)), Joi.object({ apiKey: Joi.string().required()})),
    registration: Joi.object({
        from: Joi.object({
            name: Joi.string().min(2).required(),
            email: Joi.string().email().required(),
        }).required(),
        replyTo: Joi.object({
            name: Joi.string().min(2).required(),
            email: Joi.string().email().required(),
        }).required(),
    }).required(),
}

const appEnvironmentsSchena = {
    name: Joi.string().required(),
    version: Joi.string().required(),
    contact: Joi.object({
        name: Joi.string().allow(null),
        email: Joi.string().email().allow(null),
        url: Joi.string().uri().allow(null),
    }),
};

const environmentsSchema = {
    server: serverEnvironmentsSchema,
    database: databaseEnvironmentsSchema,
    auth: authEnvironmentsSchema,
    mailing: mailingEnvironmentSchema,
    app: appEnvironmentsSchena,
};

/**
 * @memberof EnvironmentsValidators
 * @name validateEnvironments
 * @description Validates environments data using user environments schema (format and props)
 * @param {Object} data environments data
 * @returns {Joi.ValidationResult<any>} Validation results object
 */
 const validateEnvironments = (data: { [key: string]: any }) => Joi.object(environmentsSchema).validate(data, { abortEarly: false });


export default {
    validateEnvironments,
};
