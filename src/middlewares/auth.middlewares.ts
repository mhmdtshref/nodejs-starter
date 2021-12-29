import { User } from '@models';
import { UserTokenObject } from '@src/types';
import { JWTUtils, ResponseUtils } from '@utils';
import { Request, Response, NextFunction } from 'express';
import moment from 'moment';

const userAuthTokenSecret = process.env.USER_AUTH_TOKEN_SECRET as string;

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
    request.app.set('user', user?.getData());

    // Next function:
    nextFunction();

};

/*
    TODO: Add those middlewares:
    - isGuest
    - isActive
    - isPendingVerification
*/

export default {
    isAuthorized,
};
