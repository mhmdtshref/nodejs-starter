import { LoginTable, Oauth2TokenTable, PasswordTable, UserTable } from "@database/tables";
import { AuthMethod, UserRegisterRequestBody, OAuth2Provider, UserLoginRequestBody, UserRegistrationData } from "@types";
import { Includeable } from "sequelize";
import lodash from 'lodash';
import type { User } from "@models";
import HashingUtils from "./hashing.utils";
import { AuthProvidersUtils, Oauth2TokenUtils } from "./oauth2";
import ErrorUtils from "./error.utils";

/**
 * @memberof UserUtils
 * @name getPasswordLogin
 * @description Generate login row data with it's passwords (one password)
 * @param {UserRegisterRequestBody} userRegisterRequestBody Contains password details to be hashed
 * @returns {LoginTable} Returns login-table data
 */
const getPasswordLogin = (userRegisterRequestBody: UserRegisterRequestBody): { loginTableData: LoginTable, loginInclude: Includeable[] } => {

    // Check password
    if (!userRegisterRequestBody?.data?.password) {
        throw ErrorUtils.getNotFoundError('password not found', false);
    }

    // Generate password hash
    const hash = HashingUtils.hashText(userRegisterRequestBody?.data?.password as string);

    // Prepare password table-row data:
    const passwordTableData = { hash, isActive: true } as PasswordTable;

    // Prepare login table-row data:
    const loginTableData = { method: AuthMethod.Password, Passwords: [passwordTableData] } as LoginTable;
    const loginInclude = [{ model: PasswordTable }] as Includeable[];

    return { loginTableData, loginInclude };
}

/**
 * @memberof UserUtils
 * @name getOAuth2Login
 * @description Generate login row data with it's user registration auth data
 * @param {UserRegisterRequestBody} userRegisterRequestBody Contains password details to be hashed
 * @param {string} providerUserId user id in oauth2 provider system
 * @returns {LoginTable} Returns login-table data
 */
const getOAuth2Login = async (userRegisterRequestBody: UserRegisterRequestBody, providerUserId: string): Promise<{ loginTableData: LoginTable, loginInclude: Includeable[] }> => {
    if (!providerUserId) {
        throw ErrorUtils.getNotFoundError('providerUserId', false);
    }

    if (!userRegisterRequestBody.provider) {
        throw ErrorUtils.getNotFoundError('userRegisterRequestBody.provider', false);
    }

    const oauth2TokenData = { providerUserId, provider: userRegisterRequestBody.provider } as Oauth2TokenTable;

    const loginTableData = { method: AuthMethod.OAuth2, Oauth2Tokens: [oauth2TokenData] } as LoginTable;
    const loginInclude = [{ model: Oauth2TokenTable }];

    return { loginTableData, loginInclude };
}

/**
 * @memberof UserUtils
 * @name getLoginTableData
 * @description Gets login table data by credentials
 * @param {UserRegisterRequestBody} userRegisterRequestBody Contains password details to be hashed
 * @param {string} providerUserId user id in oauth2 provider system
 * @returns {LoginTable} Returns login-table data found
 */
const getLoginTableData = async (userRegisterRequestBody: UserRegisterRequestBody, providerUserId: string): Promise<{ loginTableData: LoginTable, loginInclude: Includeable[] }> => {

    let loginTableData: { loginTableData: LoginTable, loginInclude: Includeable[] };

    switch (userRegisterRequestBody.method) {
        case AuthMethod.OAuth2:
            loginTableData = await getOAuth2Login(userRegisterRequestBody, providerUserId);
            break;
        case AuthMethod.Password:
            loginTableData = getPasswordLogin(userRegisterRequestBody);
            break;
        default:
            throw ErrorUtils.getInvalidError('userRegisterRequestBody.method', false, userRegisterRequestBody.method);
    }
    if (!loginTableData) {
        throw ErrorUtils.getNotFoundError('loginTableData', false);
    }
    return loginTableData;
}

/**
 * @memberof UserUtils
 * @name getUserByEmail
 * @description Gets right login includes depending on method
 * @param {string} email Email to be used to find the user
 * @returns {Promise<UserTable | null>} Returns UserTable data-row promise
 */
const getUserByEmail = async (email: string): Promise<UserTable | null> => {
    const foundUser = await UserTable.findOne({
        where: {
            email,
        },
        include: [{
            model: LoginTable,
            required: true,
        }],
    });
    return foundUser;
}

/**
 * @memberof UserUtils
 * @name getUserByAuthenticateByPassword
 * @description Uses email and password to login
 * @param {UserLoginRequestBody} userLoginRequestBody Contains email and password to be used in login process
 * @returns {Promise<UserTable | null>} Returns UserTable data-row promise
 */
const getUserByAuthenticateByPassword = async (userLoginRequestBody: UserLoginRequestBody): Promise<UserTable> => {
    const { email, password } = userLoginRequestBody.credentials;
    if (!email || !password) {
        throw ErrorUtils.getNotFoundError('Email/password', false);
    }

    const userTableData = await getUserByEmail(email);

    if (!userTableData) {
        throw ErrorUtils.getNotFoundError('user', true);
    }
    
    // Get password-method login data
    const passwordLoginData = userTableData.Logins?.find(login => login.method === AuthMethod.Password);

    // Check if login data of password method found
    if (!passwordLoginData) {
        throw ErrorUtils.getLoginError(true);
    }

    // Get password using login id
    const passwordData = await PasswordTable.findOne({
        where: {
            LoginId: passwordLoginData.id,
            isActive: true
        },
    })

    // Check if password row found:
    if (!passwordData) {
        throw ErrorUtils.getNotFoundError('passwordData', false);
    }

    // Get password hash:
    const { hash } = passwordData;

    // Verify password:
    const isPasswordVerified = HashingUtils.verifyHash(password, hash);

    // Send error message if password is wrong:
    if (!isPasswordVerified) {
        throw ErrorUtils.getLoginError(true);
    }

    return userTableData;
}

/**
 * @memberof UserUtils
 * @name getUserDataUsingOAuth2
 * @description Check OAuth2 provider used and get user data from the provider
 * @param {string} provider oauth2 provider to be used
 * @param {string} code oauth2 code to get access token
 * @returns {Promise<UserRegistrationData>} Returns UserRegistrationAuthData
 */
 const getUserDataUsingOAuth2 = async (provider: string, code: string): Promise<UserRegistrationData> => {
    switch (provider) {
        case OAuth2Provider.facebook:
            return AuthProvidersUtils.Facebook.getUserData(code);
        case OAuth2Provider.google:
            return AuthProvidersUtils.Google.getUserData(code);
        case OAuth2Provider.linkedIn:
            return AuthProvidersUtils.LinkedIn.getUserData(code);
        default:
            throw ErrorUtils.getInvalidError('provider', false);
    }
}

/**
 * @memberof UserUtils
 * @name getUserByLoginCredentials
 * @description Login and get user credentials if success, error if fail
 * @param {UserLoginRequestBody} userLoginRequestBody Contains login-method and required login credentials
 * @returns {Promise<UserTable | null>} Returns UserTable data-row promise
 */
const getUserByLogin = async (userLoginRequestBody: UserLoginRequestBody): Promise<UserTable> => {

   let user: UserTable;

   switch (userLoginRequestBody.method) {
        case AuthMethod.OAuth2:
            const userProviderData = await getUserDataUsingOAuth2(userLoginRequestBody.provider as string, userLoginRequestBody.credentials.code as string);
            const foundUser = await getUserByEmail(userProviderData.email);
            if (!foundUser) {
                throw ErrorUtils.getNotFoundError('user', true);
            }
            user = foundUser;
            break;
        case AuthMethod.Password:
            user = await getUserByAuthenticateByPassword(userLoginRequestBody);
            break;
        default:
            throw ErrorUtils.getInvalidError('userLoginRequestBody.method', false, userLoginRequestBody.method);
   }

   return user;
}

/**
 * @memberof UserUtils
 * @name getRegisterDataByUserCreationData
 * @description Check OAuth2 provider used and get user data from the provider
 * @param {UserRegisterRequestBody} userRegisterRequestBody Contains user creation data
 * @returns {Promise<UserRegistrationData>} Returns UserRegistrationAuthData
 */
const getRegisterDataByUserCreationData = async (userRegisterRequestBody: UserRegisterRequestBody): Promise<UserRegistrationData> => {
    switch(userRegisterRequestBody.method) {
        case AuthMethod.OAuth2:
            const oauth2UserData = await getUserDataUsingOAuth2(userRegisterRequestBody.provider as string, userRegisterRequestBody.data.code as string);
            return oauth2UserData;
        case AuthMethod.Password:
            return lodash.pick(userRegisterRequestBody.data, ['firstName', 'lastName', 'email', 'birthDate']) as UserRegistrationData;
        default:
            throw ErrorUtils.getInvalidError('userRegisterRequestBody.method.method', false, userRegisterRequestBody.method)
    }
}

/**
 * @memberof UserUtils
 * @name getRegisterLoginMethodAbility
 * @description Check ability for user to create login method
 * @param {User} foundUser user found in database
 * @param {UserRegisterRequestBody} userRegisterRequestBody create user request body
 * @param {string} providerUserId user id in oauth2 provider system
 * @returns {Promise<boolean>} Returns boolean or error
 */
const getRegisterLoginMethodAbility = async (foundUser: User, userRegisterRequestBody: UserRegisterRequestBody, providerUserId: string): Promise<boolean> => {
    
    if (userRegisterRequestBody.method === AuthMethod.Password) {
        throw ErrorUtils.getRegistrationError('Email already exist', true);
    }

    const foundSameMethodLogins = foundUser.Logins?.filter(login => login.method === userRegisterRequestBody.method);
    if (foundSameMethodLogins?.length) {
        // check method name and providers for OAuth2;
        const oauthTokens = await Oauth2TokenUtils.getOauth2TokensByLoginIdsAndProvider(foundSameMethodLogins, userRegisterRequestBody.provider as string);
        if (oauthTokens.find(oauthToken => oauthToken.providerUserId !== providerUserId)) {
            throw ErrorUtils.notMatchedError('provider user id', 'saved provider user id', true);
        }
        return false;
    }
    return true;
}

/**
 * @memberof UserUtils
 * @name assignNewLoginToUser
 * @description Check ability for user to create login method
 * @param {User} user user to assign new login for
 * @param {UserRegisterRequestBody} userRegisterRequestBody create user request body
 * @param {string} providerUserId user id in oauth2 provider system
 * @returns {Promise<LoginTable>} Returns the created login table row
 */
const assignNewLoginToUser = async (user: User, userRegisterRequestBody: UserRegisterRequestBody, providerUserId: string): Promise<LoginTable> => {
    const { loginTableData, loginInclude: include } = await getLoginTableData(userRegisterRequestBody, providerUserId);
    loginTableData.UserId = user.id as number;

    const createdLogin = await LoginTable.create(loginTableData as any, { include });

    return createdLogin;
}

export default {
    getLoginTableData,
    getUserByLogin,
    getUserByEmail,
    getRegisterDataByUserCreationData,
    getRegisterLoginMethodAbility,
    assignNewLoginToUser,
}