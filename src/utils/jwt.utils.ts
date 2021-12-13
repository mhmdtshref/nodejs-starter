import JWT from 'jsonwebtoken';
import moment from 'moment';

const generateToken = (obj: { [key: string]: unknown }, secret: string) => {
    // Generate token:
    const token = JWT.sign(obj, secret);

    // Return token:
    return token;
}

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
