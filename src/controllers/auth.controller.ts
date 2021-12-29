import { Request, Response } from 'express';
import { User } from '@models';
import { JWTUtils, ResponseUtils } from '@utils';
import { AuthValidators } from '@validators';
import Logger from '@logger';

const userAuthTokenSecret = process.env.USER_AUTH_TOKEN_SECRET as string;

const register = async (request: Request, response: Response) => {
    try {
        // Get data from body:
        const data = request.body;

        // Create user instance:
        const user = new User(data);

        // Run create function:
        const createdUser = await user.create();

        if (createdUser instanceof Error) {
            ResponseUtils.badRequest(response, createdUser.message);
            return;
        }

        // Get public details for response:
        const publicData = createdUser.getPublicData();

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

        // TODO: Send email with verification link:

        // Send response:
        ResponseUtils.created(response, responseBody, 'User created successfully');

    } catch (error: any) {
        // Log error:
        Logger.error(error);

        // Send catched error message:
        ResponseUtils.badRequest(response, error?.message || 'Unknown error');
    }
}

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

        const loggedUser = await User.loginByLocalCredentials(data.email, data.password);

        // If login has error, response with error message:
        if (loggedUser instanceof Error) {
            ResponseUtils.badRequest(response, loggedUser.message);
            return;
        }

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

const verify = async (request: Request, response: Response) => {
    try {
        const { id, verificationCode } = request.body;
        const user = await User.findById(id as number);

        if (!user) {
            ResponseUtils.badRequest(response, 'User not found');
            return;
        }

        const verifiedUser = await user.verify(verificationCode as string);

        if (verifiedUser instanceof Error) {
            ResponseUtils.badRequest(response, verifiedUser.message);
            return;
        }

        ResponseUtils.success(response, user.getPublicData(), 'User verified successfully');
    } catch (error: any) {
        // Logging error:
        Logger.error(error);

        // Response with catched error:
        ResponseUtils.badRequest(response, error?.message || 'Unknown error');
    }
}

const requestVerificationEmail = (request: Request, response: Response) => {
    // TODO: Resend verification email (optional: change verification code)
    ResponseUtils.success(response, {}, 'Verification email sent successfully');
}

export default {
    register,
    login,
    verify,
    requestVerificationEmail,
};
