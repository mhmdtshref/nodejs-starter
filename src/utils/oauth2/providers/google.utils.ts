import { OAuth2Constants } from '@constants';
import { GoogleUserDataResponseData, UserRegistrationData } from '@types';
import axios from 'axios';
import ErrorUtils from '@utils/error.utils';
import environments from '@environments';

/**
 * @memberof GoogleUtils
 * @name getUserDataByProviderAccessToken
 * @description Get user data by access token
 * @param {string} accessToken access token to be used to get user data from google
 * @returns {Promise<GoogleUserDataResponseData>} Returns user data from google
 */
const getUserDataByProviderAccessToken = async (accessToken: string): Promise<GoogleUserDataResponseData> => {
    try {
        const { GET_USER_INFO_URL: url, GET_USER_INFO_ALT: alt } = OAuth2Constants.GOOGLE;
        const params = {
            alt,
            access_token: accessToken,
        };
        const userDataResponse = await axios.get(url, { params });
        return userDataResponse.data;
    } catch (error) {
        throw ErrorUtils.getServerError('Get user data by provider access token failed');
    }
};

/**
 * @memberof GoogleUtils
 * @name getAccessTokenByCode
 * @description Use authorization-code of user to get access token (to be used to get user-data from google)
 * @param {string} code User authorization-code to be used to get access token from google
 * @returns {Promise<string>} Returns access token from google
 */
const getAccessTokenByCode = async (code: string): Promise<string> => {
    try {
        const url = OAuth2Constants.GOOGLE.GET_USER_TOKEN_URL;
        const { clientId, clientSecret } = environments.auth.mathods.oauth2.providers.google;
        const { redirectUrl } = environments.auth.mathods.oauth2;
        const body = {
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uri: redirectUrl,
            code,
            grant_type: OAuth2Constants.GOOGLE.GRANT_TYPE,
        };

        const accessTokenGetResponse = await axios.post(url, body);
        return accessTokenGetResponse?.data?.access_token;
    } catch (error: any) {
        throw ErrorUtils.getServerError('Get access token by user-code failed');
    }
};

/**
 * @memberof GoogleUtils
 * @name getUserData
 * @description Handles getting google user data by authorization-code
 * @param {string} code User authorization-code to be used to access token from google
 * @returns {Promise<UserRegistrationData>} Returns user registration data (formatted after pulling them from google)
 */
const getUserData = async (code: string): Promise<UserRegistrationData> => {
    if (!code) {
        throw ErrorUtils.getNotFoundError('code', false);
    }

    const accessToken = await getAccessTokenByCode(code);
    const providerUserData = await getUserDataByProviderAccessToken(accessToken);

    return {
        firstName: providerUserData?.given_name,
        lastName: providerUserData?.family_name,
        email: providerUserData?.email,
        providerUserId: String(providerUserData?.id),
    };
}

export default {
    getUserData,
}