import { UserTable, LoginTable } from '@database/tables';
import { UserRegisterRequestBody, UserData, UserLoginRequestBody, UserPublicData, UserStatus, UserRegistrationData } from '@types';
import { ErrorUtils, MailingUtils, UserUtils } from '@utils';
import lodash from 'lodash';
import { nanoid } from 'nanoid';
import Emails from '@emails';
import environments from '@environments';

interface UserConstructorProps {
    id?: number;

    firstName?: string;

    lastName?: string;

    birthDate?: Date;

    email?: string;

    status?: UserStatus;

    verificationCode?: string;

    Logins?: LoginTable[];
}

class User {
    id?: number;

    firstName?: string;

    lastName?: string;

    email?: string;

    birthDate?: Date;

    status?: UserStatus;

    verificationCode?: string;

    Logins?: LoginTable[];

    constructor (props: UserConstructorProps) {
        this.id = props.id;
        this.firstName = props.firstName;
        this.lastName = props.lastName;
        this.email = props.email;
        this.birthDate = props.birthDate ? new Date(props.birthDate) : undefined;
        this.status = props.status;
        this.verificationCode = props.verificationCode;
        this.Logins = props?.Logins;
    }

    /**
     * @memberof User
     * @name getModel
     * @description Generated User from user database row instance
     * @param {UserTable} userTable UserTable instance
     * @returns {User} user model
     */
    static getModel = (userTable: UserTable) => new User({
            id: userTable?.id,
            firstName: userTable?.firstName,
            lastName: userTable?.lastName,
            status: userTable?.status,
            verificationCode: userTable?.verificationCode,
            email: userTable.email,
        })

    /**
     * @memberof User
     * @name getById
     * @description Get User instance by user id
     * @param {number} userId User id
     * @returns {Promise<User | null>} User if found, null if not
     */
    static getById = async (userId: number) => {
        const foundUser = await UserTable.findByPk(userId, { include: [{ model: LoginTable }] });
        if (!foundUser) {
            return null;
        }
        return new User(foundUser);
    }

    /**
     * @memberof User
     * @name getByEmail
     * @description Get User instance by user email
     * @param {string} userEmail User email
     * @returns {Promise<User | null>} User if found, null if not
     */
    static getByEmail = async (userEmail: string) => {
        const foundUser = await UserUtils.getUserByEmail(userEmail);

        if (!foundUser) {
            return null;
        }

        return new User(foundUser);
    }

    /**
     * @memberof User
     * @name create
     * @description Add the user to database
     * @param {UserRegisterRequestBody} userRegisterRequestBody Contains create user details
     * @param {string} providerUserId user id in oauth2 provider system
     * @returns {Promise<User>} User if success, error if not
     */
     create = async (userRegisterRequestBody: UserRegisterRequestBody, providerUserId: string) => {
        // Get user data:
        const userData = lodash.omitBy(this.getData(), lodash.isUndefined) as UserData;
        userData.status = UserStatus.pendingVerification;

        // Prepare login table data:
        const { loginTableData, loginInclude } = await UserUtils.getLoginTableData(userRegisterRequestBody, providerUserId);

        // Generate verification code:
        const verificationCode = nanoid(30);

        // Prepare user table-row data:
        const userTableData = {
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            birthDate: this.birthDate,
            verificationCode,
            Logins: [loginTableData],
        };

        // Create user table-row (including login and password tables-rows):
        const createdUserTableData = await UserTable.create(userTableData, {
            include: {
                model: LoginTable,
                include: loginInclude,
            },
        });

        // Return created user model:
        return User.getModel(createdUserTableData);
    }

    /**
     * @memberof User
     * @name verify
     * @description Verifies user account
     * @param {string} verificationCode Code required to verify user account
     * @returns {Promise<User>} User if success, error if not
     */
    verify = async (verificationCode: string) => {
        if (!this.id) {
            throw ErrorUtils.getNotFoundError('this.id', false);
        }

        if (!verificationCode) {
            throw ErrorUtils.getNotFoundError('verificationCode', false);
        }

        const user = await UserTable.findByPk(this.id);
        if (!user) {
            throw ErrorUtils.getNotFoundError('User', false);
        }

        if (user.verificationCode !== verificationCode) {
            throw ErrorUtils.getInvalidError('verification code', true);
        }

        const updatedUser = await user.update({ status: UserStatus.active });
        return new User(updatedUser);
    }

    /**
     * @memberof User
     * @name getData
     * @description Get instance User data object
     * @returns {UserData} User data
     */
    getData = () => lodash.pick(this, ['id', 'firstName', 'lastName', 'email', 'birthDate', 'status']) as UserData;

    /**
     * @memberof User
     * @name getPublicData
     * @description Get instance User public data object
     * @returns {UserData} User public data
     */
    getPublicData = () => lodash.pick(this, ['id', 'firstName', 'lastName', 'email', 'birthDate']) as UserPublicData;

    /**
     * @memberof User
     * @name login
     * @description Use any login method to get access token
     * @param {UserLoginRequestBody} userLoginRequestBody Data required for login
     * @returns {Promise<User>} User if success, Error if not
     */
    static login = async (userLoginRequestBody: UserLoginRequestBody) => {
        const user = await UserUtils.getUserByLogin(userLoginRequestBody);
        return new User(user);
    }

    /**
     * @memberof User
     * @name sendRegistrationEmail
     * @description Sends registration email to user
     * @returns {Promise<void>}
     */
    sendRegistrationEmail = () => MailingUtils.sendEmail({
        from: {
            name: environments.mailing.registration.from.name,
            email: environments.mailing.registration.from.email,
        },
        subject: 'New User Registration',
        to: {
            name: `${this.firstName} ${this.lastName}`,
            email: this.email as string,
        },
        html: Emails.RegistrationHtml({
            name: this.firstName as string,
            verificationUrl: `${environments.auth.frontendDomain}${environments.auth.verifyUserUrlPath}?id=${this.id}&verificationCode=${this.verificationCode}`,
        }),
    });

    /**
     * @memberof User
     * @name resendVerificationEmail
     * @description Resends verification email to user
     * @returns {Promise<void>}
     */
    resendVerificationEmail = () => MailingUtils.sendEmail({
        from: {
            name: environments.mailing.registration.from.name,
            email: environments.mailing.registration.from.email,
        },
        subject: 'Email Verification',
        to: {
            name: `${this.firstName} ${this.lastName}`,
            email: this.email as string,
        },
        html: Emails.EmailVerificationEmail({
            name: this.firstName as string,
            verificationUrl: `${environments.auth.frontendDomain}${environments.auth.verifyUserUrlPath}?id=${this.id}&verificationCode=${this.verificationCode}`,
        }),
    })

    static createOrFindUser = async (userRegisterRequestBody: UserRegisterRequestBody, userRegistrationData: UserRegistrationData) => {

        // Check duplicated email:
        const foundUser = await User.getByEmail(userRegistrationData.email);

        // Check if user found in database:
        if (foundUser) {
            // Check if data passed can be used to create new login method:
            const registerNewLoginAbility = await UserUtils.getRegisterLoginMethodAbility(foundUser, userRegisterRequestBody, userRegistrationData?.providerUserId as string);

            // Create login method if ability check is true:
            if (registerNewLoginAbility) {
                await UserUtils.assignNewLoginToUser(foundUser, userRegisterRequestBody, userRegistrationData?.providerUserId as string);
            }

            // Return found user:
            return foundUser;
        }

        // Create user instance:
        const userToCreate = new User(lodash.pick(userRegistrationData, ['firstName', 'lastName', 'email', 'birthDate']));

        // Run create function:
        const createdUser = await userToCreate.create(userRegisterRequestBody, userRegistrationData?.providerUserId as string);

        // Return created user:
        return createdUser;
    }

}

export default User;
