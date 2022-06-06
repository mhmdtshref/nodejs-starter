import { OAuth2Constants } from '@constants';
import { FacebookUserDataResponseData, UserRegistrationData } from '@types';
import axios from 'axios';
import ErrorUtils from '@utils/error.utils';
import environments from '@src/environments';

/**
 * @memberof FacebookUtils
 * @name getUserDataByProviderAccessToken
 * @description Get user data by access token
 * @param {string} accessToken access token to be used to get user data from facebook
 * @returns {Promise<FacebookUserDataResponseData>} Returns user data from facebook
 */
const getUserDataByProviderAccessToken = async (accessToken: string): Promise<FacebookUserDataResponseData> => {
    try {
        const url = OAuth2Constants.FACEBOOK.GET_USER_INFO_URL;
        const params = {
            access_token: accessToken,
            fields: 'id,first_name,last_name,email',
        };
        const userDataResponse = await axios.get(url, { params });

        return userDataResponse.data;
    } catch (error) {
        throw ErrorUtils.getServerError('Get user data by provider access token failed');
    }
};

/**
 * @memberof FacebookUtils
 * @name getAccessTokenByCode
 * @description Use authorization-code of user to get access token (to be used to get user-data from facebook)
 * @param {string} code User authorization-code to be used to get access token from facebook
 * @returns {Promise<string>} Returns access token from facebook
 */
const getAccessTokenByCode = async (code: string): Promise<string> => {
    try {
        const url = OAuth2Constants.FACEBOOK.GET_USER_TOKEN_URL;
        const { clientId, clientSecret } = environments.auth.mathods.oauth2.providers.facebook;
        const { redirectUrl } = environments.auth.mathods.oauth2;
        const params = {
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uri: redirectUrl,
            code,
        };

        const accessTokenGetResponse = await axios(url, { params });
        return accessTokenGetResponse?.data?.access_token;
    } catch (error: any) {
        throw ErrorUtils.getServerError('Get access token by user-code failed');
    }
};

/**
 * @memberof FacebookUtils
 * @name getUserData
 * @description Handles getting facebook user data by authorization-code
 * @param {string} code User authorization-code to be used to access token from facebook
 * @returns {Promise<UserRegistrationData>} Returns user registration data (formatted after pulling them from facebook)
 */
const getUserData = async (code: string): Promise<UserRegistrationData> => {
    if (!code) {
        throw ErrorUtils.getNotFoundError('code', false);
    }

    const accessToken = await getAccessTokenByCode(code);
    const providerUserData = await getUserDataByProviderAccessToken(accessToken);

    return {
        firstName: providerUserData?.first_name,
        lastName: providerUserData?.last_name,
        email: providerUserData?.email,
        providerUserId: String(providerUserData?.id),
    };
}

export default {
    getUserData,
}