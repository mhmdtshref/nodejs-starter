import { UserTable, LoginTable } from '@database/tables';
import { UserValidators } from '@validators';
import { LoginProvider, UserStatus } from '@types';
import { HashingUtils } from '@utils';
import lodash from 'lodash';
import { nanoid } from 'nanoid';

interface UserConstructorProps {
    id?: number;

    firstName?: string;

    lastName?: string;

    birthDate?: Date;

    email?: string;

    passwordHash?: string;

    password?: string;

    status?: UserStatus;

    verificationCode?: string;
}

class User {
    id?: number;

    firstName?: string;

    lastName?: string;

    birthDate?: Date;

    email?: string;

    passwordHash?: string;

    password?: string;

    status?: UserStatus;

    verificationCode?: string;

    constructor (data: UserConstructorProps) {
        this.id = data.id;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.email = data.email;
        this.passwordHash = data.passwordHash;
        this.password = data.password;
        this.birthDate = data.birthDate ? new Date(data.birthDate) : undefined;
        this.status = data.status;
    }

    static getModel = (userTable: UserTable) => {
        const localLogin = userTable?.Logins?.find(login => login?.provider === LoginProvider.local);
        return new User({
            id: userTable?.id,
            firstName: userTable?.firstName,
            lastName: userTable?.lastName,
            status: userTable?.status,
            email: localLogin?.email,
            passwordHash: localLogin?.passwordHash,
        });
    }

    static findById = async (userId: number) => {
        const foundUser = await UserTable.findByPk(userId, { include: [{ model: LoginTable }] });
        if (!foundUser) {
            return null;
        }
        return this.getModel(foundUser);
    }

    static findByEmail = async (userEmail: string) => {
        const foundUser = await UserTable.findOne({ include: [{ model: LoginTable, where: { email: userEmail }, required: true }] });
        if (!foundUser) {
            return null;
        }
        return this.getModel(foundUser);
    }

    create = async () => {
        // Get user data:
        const userData = lodash.omitBy(this.getData(), lodash.isUndefined);
        userData.status = UserStatus.pendingVerification;
        const { email, password } = userData;

        // Validate user details:
        const validationResult = UserValidators.validateUserCreate(userData);

        // Check validation errors:
        if (validationResult.error) {
            return Error(validationResult.error.message);
        }

        // Check duplicated email:
        const foundUser = await User.findByEmail(userData.email as string);
        if (foundUser) {
            return new Error('User exists with sent email');
        }

        // Hash password
        const passwordHash = HashingUtils.hashText(password as string);

        // Prepare login and user tables data:
        const loginTable = { email, passwordHash } as LoginTable;
        const verificationCode = nanoid(30);

        const userTable = { firstName: this.firstName, lastName: this.lastName, birthDate: this.birthDate, verificationCode, Logins: [loginTable] } as UserTable;

        // Create row:
        const createdTable = await UserTable.create(userTable, { include: [{ model: LoginTable }] });

        // Return created user model:
        return User.getModel(createdTable);
    }

    verify = async (verificationCode: string) => {
        if (!this.id) {
            throw new Error('this.id not found');
        }

        if (!verificationCode) {
            throw new Error('verificationCode not found');
        }

        const user = await UserTable.findByPk(this.id);
        if (!user) {
            throw new Error('User not found');
        }

        if (user.verificationCode !== verificationCode) {
            return new Error('Invalid verification code');
        }

        const updatedUser = await user.update({ status: UserStatus.active });
        return new User(updatedUser);
    }

    getData = () => lodash.pick(this, ['id', 'firstName', 'lastName', 'birthDate', 'email', 'password', 'status']);

    getPublicData = () => ({
        id: this.id,
        firstName: this.firstName,
        lastName: this.lastName,
        birthDate: this.birthDate,
        email: this.email,
    });

    static loginByLocalCredentials = async (email: string, password: string) => {
        if (!email || !password) {
            throw new Error('Email or password not found');
        }

        const user = await this.findByEmail(email);

        if (!user) {
            return new Error('No user found with passed email');
        }

        // Get password hash:
        const passwordHash = user?.passwordHash as string;

        // Verify password:
        const isPasswordVerified = HashingUtils.verifyHash(password, passwordHash);

        // Send error message if password is wrong:
        if (!isPasswordVerified) {
            return new Error('Invalid password for passed email');
        }

        return user;
    }

}

export default User;
