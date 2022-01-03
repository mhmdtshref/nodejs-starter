import { Model, tableConfigs } from '@database/settings.database';
import { DataTypes } from 'sequelize';
import { UserStatus } from '@types';
import Validators from '@database/validator.database';
import LoginTable from '@database/tables/login.table';

class User extends Model {
    id?: number;

    firstName!: string;

    lastName!: string;

    birthDate?: Date;

    status!: UserStatus;

    verificationCode!: string;

    Logins?: LoginTable[];
}

User.init({
    firstName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: Validators.stringValidateObject('firstName', false, { min: 2, max: 255 }),
    },
    lastName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: Validators.stringValidateObject('lastName', false, { min: 2, max: 255 }),
    },
    birthDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        validate: Validators.dateValidateObject('brithDate', true, new Date()),
    },
    status: {
        type: DataTypes.ENUM(...Object.values(UserStatus)),
        allowNull: false,
        defaultValue: UserStatus.pendingVerification,
        validate: Validators.enumValidateObject('status', Object.values(UserStatus), true),
    },
    verificationCode: {
        type: DataTypes.STRING(32),
        allowNull: false,
        validate: Validators.stringValidateObject('verificationCode', false, { min: 30, max: 30 }),
    }
}, tableConfigs);

export default User;