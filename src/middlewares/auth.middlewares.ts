import { User } from '@models';
import { UserStatus, UserTokenObject } from '@src/types';
import { JWTUtils, ResponseUtils } from '@utils';
import { Request, Response, NextFunction } from 'express';
import moment from 'moment';

const userAuthTokenSecret = process.env.USER_AUTH_TOKEN_SECRET as string;

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
    
    // Get token from header:
    const token = request.headers.authorization?.replace('Bearer ', '') as string;

    if (!token) {
        ResponseUtils.unauthorized(response, 'No token found in headers');
    }

    // Verify token:
    const decodedToken = JWTUtils.decodeToken(token, userAuthTokenSecret) as UserTokenObject;

    // If token is invalid:
    if (!decodedToken) {
        ResponseUtils.unauthorized(response, 'Invalid token value');
    }

    if (moment().isAfter(decodedToken.expirationDate)) {
        ResponseUtils.unauthorized(response, 'Token is expired');
    }

    // Get user by Id:
    const user = await User.findById(decodedToken.id);

    // Check if user found:
    if (!user) {
        ResponseUtils.badRequest(response, 'User not found');
    }

    // Save user details in request app:
    request.app.set('user', user);

    // Next function:
    nextFunction();

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

    // Get token from header:
    const token = request.headers.authorization?.replace('Bearer ', '') as string;

    // Check if token found:
    if (token) {
        ResponseUtils.unauthorized(response, 'Token error');
    }

    // Continue to next function:
    nextFunction();
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

    // Get user:
    const user = request.app.get('user') as User;

    if (!user) {
        ResponseUtils.unauthorized(response, 'No user authenticated');
    }

    // Check user status if active or not:
    if (user.status !== UserStatus.active) {
        ResponseUtils.unauthorized(response, 'User is inavtive');
    }

    // Continue to next function:
    nextFunction();
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

    // Get user:
    const user = request.app.get('user') || (await User.findById(Number(request.query.id)));

    if (!user) {
        ResponseUtils.unauthorized(response, 'No user found');
    }

    // Check if user is pending:
    if (user.status !== UserStatus.pendingVerification) {
        ResponseUtils.unauthorized(response, 'User status is not pending verification');
    }

    // Continue to next function:
    nextFunction();
}

export default {
    isAuthorized,
    isGuest,
    isActive,
    isPendingVerification,
};
