import { OAuth2Constants } from '@constants';
import { LinkedInUserDataResponseData, LinkedInUserEmailResponseData, UserRegistrationData } from '@types';
import axios from 'axios';
import ErrorUtils from '@utils/error.utils';
import environments from '@environments';
import qs from 'qs';

/**
 * @memberof LinkedInUtils
 * @name getUserDataByProviderAccessToken
 * @description Get user data by access token
 * @param {string} accessToken access token to be used to get user data from linkedIn
 * @returns {Promise<LinkedInUserDataResponseData>} Returns user data from linkedIn
 */
const getUserDataByProviderAccessToken = async (accessToken: string): Promise<LinkedInUserDataResponseData> => {
    try {
        const { GET_USER_INFO_URL: url } = OAuth2Constants.LINKED_IN;
        const headers = {
            Authorization: `Bearer ${accessToken}`,
        };
        const userDataResponse = await axios.get(url, { headers });
        return userDataResponse.data;
    } catch (error) {
        throw ErrorUtils.getServerError('Get user data by provider access token failed');
    }
};

/**
 * @memberof LinkedInUtils
 * @name getUserEmailByProviderAccessToken
 * @description Get user data by access token
 * @param {string} accessToken access token to be used to get user data from linkedIn
 * @returns {Promise<LinkedInUserEmailResponseData>} Returns user data from linkedIn
 */
 const getUserEmailByProviderAccessToken = async (accessToken: string): Promise<LinkedInUserEmailResponseData> => {
    try {
        const { GET_USER_EMAIL_URL: url } = OAuth2Constants.LINKED_IN;
        const headers = {
            Authorization: `Bearer ${accessToken}`,
        };
        const userDataResponse = await axios.get(url, { headers });
        return userDataResponse.data;
    } catch (error) {
        throw ErrorUtils.getServerError('Get user data by provider access token failed');
    }
};

/**
 * @memberof LinkedInUtils
 * @name getAccessTokenByCode
 * @description Use authorization-code of user to get access token (to be used to get user-data from linkedIn)
 * @param {string} code User authorization-code to be used to get access token from linkedIn
 * @returns {Promise<string>} Returns access token from linkedIn
 */
const getAccessTokenByCode = async (code: string): Promise<string> => {
    try {
        const { GET_USER_TOKEN_URL: url, GRANT_TYPE: grantType } = OAuth2Constants.LINKED_IN;
        const { clientId, clientSecret } = environments.auth.mathods.oauth2.providers.linkedIn;
        const { redirectUrl } = environments.auth.mathods.oauth2;
        const body = {
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uri: redirectUrl,
            code,
            grant_type: grantType,
        };
        const accessTokenGetResponse = await axios.post(url, qs.stringify(body));
        return accessTokenGetResponse?.data?.access_token;
    } catch (error: any) {
        throw ErrorUtils.getServerError('Get access token by user-code failed');
    }
};

/**
 * @memberof LinkedInUtils
 * @name getUserData
 * @description Handles getting linkedIn user data by authorization-code
 * @param {string} code User authorization-code to be used to access token from linkedIn
 * @returns {Promise<UserRegistrationData>} Returns user registration data (formatted after pulling them from linkedIn)
 */
const getUserData = async (code: string): Promise<UserRegistrationData> => {
    if (!code) {
        throw ErrorUtils.getNotFoundError('code', false);
    }

    const accessToken = await getAccessTokenByCode(code);
    const providerUserData = await getUserDataByProviderAccessToken(accessToken);
    const providerUserEmail = await getUserEmailByProviderAccessToken(accessToken);

    return {
        firstName: providerUserData?.localizedFirstName,
        lastName: providerUserData?.localizedLastName,
        email: providerUserEmail?.elements[0]?.['handle~']?.emailAddress,
        providerUserId: String(providerUserData?.id),
    };
}

export default {
    getUserData,
}