import { Model, tableConfigs } from '@database/settings.database';
import { DataTypes } from 'sequelize';
import Validators from '../validator.database';

class ResetPassword extends Model {
    id!: number;

    resetCodeHash!: string;
    
    previousPasswordHash!: string;

    LoginId!: number;
}

ResetPassword.init({
    resetCodeHash: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: Validators.stringValidateObject('resetCodeHash', false, { min: 255, max: 4095 }),
    },
    passwordHash: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: Validators.stringValidateObject('previousPasswordHash', false, { min: 255, max: 4095 }),
    },
}, tableConfigs);

export default ResetPassword;
