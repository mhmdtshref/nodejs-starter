import winston from 'winston';

const logger = winston.createLogger({
    format: winston.format.simple(),
    transports: [
        new winston.transports.File({ filename: '@logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: '@logs/combined.log', level: 'info' }),
    ],
});

/**
 * @memberof LoggerUtils
 * @name logError
 * @description Add an error to errors and combined logs file
 * @param {any} error error needs to be added, usually a string or error type
 * @returns {void} Returns an empty promise
 */
const logError = (error: any) => {
    logger.error(error)
}

/**
 * @memberof LoggerUtils
 * @name logInfo
 * @description Add an info to combined logs file
 * @param {any} info Info needs to be added, usually a string or object type
 * @returns {void} Returns an empty promise
 */
const logInfo = (info: any): void => {
    logger.info(info);
}

export default {
    error: logError,
    info: logInfo
};
