import path from 'path';
import dotenv from 'dotenv';
import ErrorUtils from '@utils/error.utils';

if (!process.env.NODE_ENV) {
    throw ErrorUtils.getServerError('Please set NODE_ENV variable');
}

const environment = process.env.NODE_ENV;
const envFilePath = path.resolve(process.cwd(), `.env.${environment}`);

dotenv.config({
    path: envFilePath,
});

const environments = {
    server: {
        host: process.env.SERVER_HOST as string,
        port: process.env.SERVER_PORT as string,
        whitelistOrigins: (process.env.SERVER_WHITELIST_ORIGINS?.length ? process.env.SERVER_WHITELIST_ORIGINS?.split(',') : []) as string[],
    },
    database: {
        host: process.env.DATABASE_HOST as string,
        port: Number(process.env.DATABASE_PORT),
        username: process.env.DATABASE_USERNAME as string,
        password: process.env.DATABASE_PASSWORD as string,
        database: process.env.DATABASE_DATABASE_NAME as string,
        logging: Boolean(Number(process.env.DATABASE_LOGGING)),
        dialect: process.env.DATABASE_DIALECT as string,
    },
    auth: {
        userTokenSecret: process.env.AUTH_USER_TOKEN_SECRET as string,
        verifyUserUrlPath: process.env.AUTH_VERIFY_USER_URL_PATH as string,
        frontendDomain: process.env.AUTH_FRONTEND_DONAIN as string,
        mathods: {
            oauth2: {
                redirectUrl: process.env.AUTH_METHODS_OAUTH2_REDIRECT_URL,
                providers: {
                    facebook: {
                        clientId: process.env.AUTH_METHODS_OAUTH2_PROVIDERS_FACEBOOK_CLIENT_ID,
                        clientSecret: process.env.AUTH_METHODS_OAUTH2_PROVIDERS_FACEBOOK_CLIENT_SECRET,
                    },
                    google: {
                        clientId: process.env.AUTH_METHODS_OAUTH2_PROVIDERS_GOOGLE_CLIENT_ID,
                        clientSecret: process.env.AUTH_METHODS_OAUTH2_PROVIDERS_GOOGLE_CLIENT_SECRET,
                    },
                    linkedIn: {
                        clientId: process.env.AUTH_METHODS_OAUTH2_PROVIDERS_LINKED_IN_CLIENT_ID,
                        clientSecret: process.env.AUTH_METHODS_OAUTH2_PROVIDERS_LINKED_IN_CLIENT_SECRET,
                    }
                },
            },
        },
    },
    mailing: {
        providers: {
            sendgrid: {
                apiKey: process.env.MAILING_PROVIDERS_SENDGRID_API_KEY as string,
            },
        },
        registration: {
            from: {
                name: process.env.MAILING_REGISTRATION_FROM_NAME as string,
                email: process.env.MAILING_REGISTRATION_FROM_EMAIL as string,
            },
            replyTo: {
                name: process.env.MAILING_REGISTRATION_REPLY_TO_EMAIL as string,
                email: process.env.MAILING_REGISTRATION_REPLY_TO_NAME as string,
            },
        },
    },
    app: {
        name: process.env.APP_NAME as string,
        version: process.env.APP_VERSION as string,
        contact: {
            name: process.env.APP_CONTACT_NAME as string,
            email: process.env.APP_CONTACT_EMAIL as string,
            url: process.env.APP_CONTACT_URL as string,

        },
    },
}

export default environments;
