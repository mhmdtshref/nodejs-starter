import { Model, tableConfigs } from '@database/settings.database';
import { LoginProvider } from '@src/types';
import { DataTypes } from 'sequelize';
import Validators from '../validator.database';

class Login extends Model {
    id!: number;

    email!: string;

    passwordHash!: string;

    provider!: LoginProvider.local;

    UserId!: number;
}

Login.init({
    email: {
        type: DataTypes.STRING(511),
        allowNull: false,
        validate: Validators.stringValidateObject('firstName', false, { min: 2, max: 255 }),
    },
    passwordHash: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: Validators.stringValidateObject('passwordHash', false, { min: 255, max: 4095 }),
    },
    provider: {
        type: DataTypes.ENUM(...Object.values(LoginProvider)),
        allowNull: false,
        defaultValue: LoginProvider.local,
    },
}, tableConfigs);

export default Login;
