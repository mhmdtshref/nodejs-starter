import { Model, tableConfigs } from '@database/settings.database';
import { DataTypes } from 'sequelize';
import LoginTable from './login.table';
import Validators from '../validator.database';

class User extends Model {
    id?: number;

    firstName!: string;

    lastName!: string;

    birthDate?: Date;

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
}, tableConfigs);

export default User;