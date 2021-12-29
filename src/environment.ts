import path from 'path';
import dotenv from 'dotenv';

if (!process.env.NODE_ENV) {
    throw new Error('Please set NODE_ENV variable');
}
const environment = process.env.NODE_ENV;
const envFilePath = path.resolve(process.cwd(), `.env.${environment}`);

dotenv.config({
    path: envFilePath,
});

const requiredVariables = [
    // Server:
    'HOST',
    'PORT',

    // Database:
    'DB_USER',
    'DB_USER_PASSWORD',
    'DB_SERVER_HOST',
    'DB_SERVER_PORT',
    'DB_NAME',
    'DB_LOGGING',

    // Auth Keys:
    'USER_AUTH_TOKEN_SECRET',

    // Mailing:
    'SEND_GRID_API_KEY',

    // App:
    'APP_NAME',
    'APP_CONTACT_NAME',
    'APP_CONTACT_EMAIL',
    'APP_CONTACT_URL',
    'APP_VERSION',
];
const missedVariables = requiredVariables.filter((v) => !process.env[v]);

if (missedVariables.length) {
    throw new Error(`Please add these environment variables: ${missedVariables}`);
}
