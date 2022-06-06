import { User } from '@models';
import { UserStatus, UserTokenObject } from '@types';
import { JWTUtils, ResponseUtils } from '@utils';
import { Request, Response, NextFunction } from 'express';
import moment from 'moment';
import Configs from '@configs';
import Logger from '@logger';
import environments from '@environments';
import lodash from 'lodash';

/**
 * @memberof AuthMiddleware
 * @name isAuthorized
 * @description Verifies if user author
 * @param {Request} request Request
 * @param {Response} response Response
 * @param {NextFunction} nextFunction Next function
 * @returns {Promise<void>}
 */
const isAuthorized = async (request: Request, response: Response, nextFunction: NextFunction) => {
    try {
        // Get token from header:
        const token = request.headers.authorization?.replace('Bearer ', '') as string;

        if (!token) {
            ResponseUtils.unauthorized(response, 'No token found in headers');
            return;
        }

        // Verify token:
        const decodedToken = JWTUtils.decodeToken(token, environments.auth.userTokenSecret) as UserTokenObject;

        // If token is invalid:
        if (!decodedToken) {
            ResponseUtils.unauthorized(response, 'Invalid token value');
            return;
        }

        if (moment().isAfter(decodedToken.expirationDate)) {
            ResponseUtils.unauthorized(response, 'Token is expired');
            return;
        }

        // Get user by Id:
        const user = await User.getById(decodedToken.id);

        // Check if user found:
        if (!user) {
            ResponseUtils.badRequest(response, 'User not found');
            return;
        }

        // Save user details in request app:
        request.app.set('user', user);

        // Next function:
        nextFunction();
    } catch (error: any) {
        // Logging error:
        Logger.error(error);

        // Response with catched error:
        ResponseUtils.badRequest(response, error?.message || 'Unknown error');
    }
};

/**
 * @memberof AuthMiddleware
 * @name isGuest
 * @description Verifies if no token (no user)
 * @param {Request} request Request
 * @param {Response} response Response
 * @param {NextFunction} nextFunction Next function
 * @returns {void}
 */
const isGuest = (request: Request, response: Response, nextFunction: NextFunction) => {

    try {
        // Get token from header:
        const token = request.headers.authorization?.replace('Bearer ', '') as string;

        // Check if token found:
        if (token) {
            ResponseUtils.unauthorized(response, 'Token error');
            return;
        }

        // Continue to next function:
        nextFunction();
    } catch (error: any) {
        // Logging error:
        Logger.error(error);

        // Response with catched error:
        ResponseUtils.badRequest(response, error?.message || 'Unknown error');
    }
}

/**
 * @memberof AuthMiddleware
 * @name isActive
 * @description Verifies if user status is active
 * @param {Request} request Request
 * @param {Response} response Response
 * @param {NextFunction} nextFunction Next function
 * @returns {void}
 */
const isActive = (request: Request, response: Response, nextFunction: NextFunction) => {

    try {
        if (!Configs.emailValidation) {
            ResponseUtils.badRequest(response, 'email validation disabled');
            Logger.error('Call isPendingVerification middleware while it is disabled in configs');
            return;
        }

        // Get user:
        const user = request.app.get('user') as User;

        if (!user) {
            ResponseUtils.unauthorized(response, 'No user authenticated');
            return;
        }

        // Check user status if active or not:
        if (user.status !== UserStatus.active) {
            ResponseUtils.unauthorized(response, 'User is inavtive');
            return;
        }

        // Continue to next function:
        nextFunction();
    } catch (error: any) {
        // Logging error:
        Logger.error(error);

        // Response with catched error:
        ResponseUtils.badRequest(response, error?.message || 'Unknown error');
    }
}

/**
 * @memberof AuthMiddleware
 * @name isPendingVerification
 * @description Verifies if user status is pending-verification
 * @param {Request} request Request
 * @param {Response} response Response
 * @param {NextFunction} nextFunction Next function
 * @returns {Promise<void>}
 */
const isPendingVerification = async (request: Request, response: Response, nextFunction: NextFunction) => {
    try {
        if (!Configs.emailValidation) {
            Logger.error('Call isPendingVerification middleware while it is disabled in configs');
            ResponseUtils.badRequest(response, 'email validation disabled');
            return;
        }

        let user = request.app.get('user');

        if (!user) {
            const idString = request.query.id || request.params.id;

            if (!idString) {
                ResponseUtils.badRequest(response, 'id is required');
                return;
            }

            const id = Number(idString);

            if (lodash.isNaN(id)) {
                ResponseUtils.badRequest(response, 'id is not a valid number value');
                return;
            }

            user = await User.getById(id);
        }

        if (!user) {
            ResponseUtils.unauthorized(response, 'No user found');
            return;
        }

        // Check if user is pending:
        if (user.status !== UserStatus.pendingVerification) {
            ResponseUtils.unauthorized(response, 'User status is not pending verification');
            return;
        }

        // Continue to next function:
        nextFunction();
    } catch (error: any) {
        // Logging error:
        Logger.error(error);

        // Response with catched error:
        ResponseUtils.badRequest(response, error?.message || 'Unknown error');
    }

}

export default {
    isAuthorized,
    isGuest,
    isActive,
    isPendingVerification,
};
