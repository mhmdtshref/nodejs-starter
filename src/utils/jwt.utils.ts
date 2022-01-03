import JWT from 'jsonwebtoken';
import moment from 'moment';

/**
 * @memberof JwtUtils
 * @name generateToken
 * @description Generate token using secret and object (JWT token)
 * @param {Object} obj Object to sign
 * @param {string} secret Secret to use it in signing
 * @returns {string} Generated token
 */
const generateToken = (obj: { [key: string]: unknown }, secret: string) => {
    // Generate token:
    const token = JWT.sign(obj, secret);

    // Return token:
    return token;
}

/**
 * 
 * @memberof JwtUtils
 * @name decodeToken
 * @description Decode token to it's origin (before sign)
 * @param {string} token token to decode
 * @param {string} secret secret that used to sign payload
 * @returns {JWT.JwtPayload | false} payload or false
 */
const decodeToken = (token: string, secret: string) => {
    try {
        // Decode token:
        const decoded = JWT.verify(token, secret);

        // Return decoded:
        return decoded as JWT.JwtPayload;
    } catch (error) {
        return false;
    }
}

/**
 * @memberof JwtUtils
 * @name getExpirationDate
 * @description Gives the date after the number of days sent in params
 * @param {number} days number of days to expire
 * @returns {Date} expiration date
 */
const getExpirationDate = (days: number) => {
    // Create expiration date:
    const expirationDate = moment().add(days, 'days').toDate();

    // Return expiration date:
    return expirationDate;
}

export default {
    generateToken,
    decodeToken,
    getExpirationDate,
};
