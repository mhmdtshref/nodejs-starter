import { Model, tableConfigs } from '@database/settings.database';
import { DataTypes } from 'sequelize';
import Validators from '../validator.database';

class Password extends Model {
    id!: number;

    hash!: string;

    isActive!: boolean;

    LoginId!: number;
}

Password.init({
    hash: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: Validators.stringValidateObject('hash', false),
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
}, tableConfigs);

export default Password;
