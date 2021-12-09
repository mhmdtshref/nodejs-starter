import winston from 'winston';

const logger = winston.createLogger({
    format: winston.format.simple(),
    transports: [
        new winston.transports.File({ filename: './src/logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: './src/logs/combined.log', level: 'info' }),
    ],
});

const logError = (error: any) => {
    logger.error(error)
}

const logInfo = (info: any) => {
    logger.info(info);
}

export default {
    error: logError,
    info: logInfo
};
