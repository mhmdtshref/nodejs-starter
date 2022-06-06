const OAUTH2_REDIRECT_URL = process.env.OAUTH2_REDIRECT_URL as string;

// Facebook OAuth2 data:
const FACEBOOK = {
    GET_USER_TOKEN_URL: 'https://graph.facebook.com/v4.0/oauth/access_token',
    GET_USER_INFO_URL: 'https://graph.facebook.com/me',
}

const GOOGLE = {
    GET_USER_TOKEN_URL: 'https://oauth2.googleapis.com/token',
    GET_USER_INFO_URL: 'https://www.googleapis.com/oauth2/v1/userinfo',
    GET_USER_INFO_ALT: 'json',
    GRANT_TYPE: 'authorization_code',
}

const LINKED_IN = {
    GET_USER_TOKEN_URL: 'https://www.linkedin.com/oauth/v2/accessToken',
    GET_USER_INFO_URL: 'https://api.linkedin.com/v2/me',
    GET_USER_EMAIL_URL: 'https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~(emailAddress)))',
    GRANT_TYPE: 'authorization_code'
}

export default {
    OAUTH2_REDIRECT_URL,
    FACEBOOK,
    GOOGLE,
    LINKED_IN,
};
