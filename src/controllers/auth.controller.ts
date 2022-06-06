import { Request, Response } from 'express';
import { User } from '@models';
import { JWTUtils, ResponseUtils, UserUtils } from '@utils';
import { AuthValidators, UserValidators } from '@validators';
import Logger from '@logger';
import Configs from '@configs';
import { AuthMethod, UserRegisterRequestBody } from '@types';
import environments from '@environments';


const userAuthTokenSecret = environments.auth.userTokenSecret;

/**
 * @memberof AuthController
 * @name register
 * @description Register new user API handler
 * @param {Request} request Request
 * @param {Response} response Response
 * @returns {Promise<void>}
 */
const register = async (request: Request, response: Response) => {
    try {
        // Get data from body:
        const userRegisterRequestBody = request.body as UserRegisterRequestBody;

        // Get user data from body:
        const userRegistrationData = await UserUtils.getRegisterDataByUserCreationData(userRegisterRequestBody);

        // Validate user details:
        const validationData = userRegisterRequestBody?.method === AuthMethod.Password
        ? { ...userRegistrationData, password: userRegisterRequestBody?.data?.password }
        : userRegistrationData;
        const validationResult = UserValidators.validateUserCreate(validationData, userRegisterRequestBody.method);

        // Check validation errors:
        if (validationResult.error) {
            ResponseUtils.badRequest(response, validationResult.error.message);
            return;
        }

        // Get user:
        const user = await User.createOrFindUser(userRegisterRequestBody, userRegistrationData);

        // Get public details for response:
        const publicData = user.getPublicData();

        // Generate expiration date:
        const expirationDate = JWTUtils.getExpirationDate(30);

        // Prepare token object:
        const tokenObject = {
            ...publicData,
            expirationDate,
        }

        // Generate token:
        const token = JWTUtils.generateToken(tokenObject, userAuthTokenSecret);

        // Prepare response body:
        const responseBody = {
            ...publicData,
            expirationDate,
            token,
        };

        // Send response:
        ResponseUtils.created(response, responseBody, 'User login method added successfully');

        // Send email with verification link:
        if (Configs.emailValidation) {
            user.sendRegistrationEmail()
            .catch((error: any) => {
                // Log error:
                Logger.error(error);
            })
        }
    } catch (error: any) {
        // Log error:
        Logger.error(error);

        // Send catched error message:
        ResponseUtils.badRequest(response, error?.message || 'Unknown error');
    }
}

/**
 * @memberof AuthController
 * @name login
 * @description User login API handler
 * @param {Request} request Request
 * @param {Response} response Response
 * @returns {Promise<void>}
 */
const login = async (request: Request, response: Response) => {
    try {
        // Get data from body:
        const data = request.body;

        // Validate data:
        const validationResult = AuthValidators.validateLoginData(data);

        // If data inavlid, response with error message:
        if (validationResult.error) {
            ResponseUtils.badRequest(response, validationResult.error.message);
        }

        // Use credentials to get login user:
        const loggedUser = await User.login(data);

        // Get public data:
        const publicData = loggedUser.getPublicData();

        // Generate expiration date:
        const expirationDate = JWTUtils.getExpirationDate(30);

        // Prepare tojen object:
        const tokenObject = {
            ...publicData,
            expirationDate,
        };

        // Generate token:
        const token = JWTUtils.generateToken(tokenObject, userAuthTokenSecret);

        // Prepare response body:
        const responseBody = {
            ...publicData,
            expirationDate,
            token,
        };

        // Send response:
        ResponseUtils.success(response, responseBody, 'Logged in successfully');

    } catch (error: any) {
        // Log error:
        Logger.error(error);

        // Response with catched error:
        ResponseUtils.badRequest(response, error?.message || 'Unknown error');
    }
}

/**
 * @memberof AuthController
 * @name verify
 * @description Verify user API handler
 * @param {Request} request Request
 * @param {Response} response Response
 * @returns {Promise<void>}
 */
const verify = async (request: Request, response: Response) => {
    try {
        // Destructure request body:
        const { verificationCode } = request.body;

        // Get user by id:
        const user = request.app.get('user');

        // Check if user not found:
        if (!user) {
            ResponseUtils.badRequest(response, 'User not found');
            return;
        }

        // Verify and get user:
        const verifiedUser = await user.verify(verificationCode as string);

        // Response with user public data:
        ResponseUtils.success(response, verifiedUser.getPublicData(), 'User verified successfully');
    } catch (error: any) {
        // Logging error:
        Logger.error(error);

        // Response with catched error:
        ResponseUtils.badRequest(response, error?.message || 'Unknown error');
    }
}

/**
 * @memberof AuthController
 * @name requestVerificationEmail
 * @description Request new verification email handler
 * @param {Request} request Request
 * @param {Response} response Response
 * @returns {Promise<void>}
 */
const requestVerificationEmail = async (request: Request, response: Response) => {
    try {
        const user = request.app.get('user') as User;
        await user.sendRegistrationEmail();

        ResponseUtils.success(response, user.getPublicData(), 'Verification email resent successfully');
    } catch (error: any) {
        // Log error:
        Logger.error(error);

        // Response with error message:
        ResponseUtils.badRequest(response, error?.message || 'Unknown error');
    }
    
}

export default {
    register,
    login,
    verify,
    requestVerificationEmail,
};
