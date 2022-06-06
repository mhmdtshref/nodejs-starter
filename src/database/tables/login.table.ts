import { Model, tableConfigs } from '@database/settings.database';
import { AuthMethod } from '@types';
import { DataTypes } from 'sequelize';
import Validators from '@database/validator.database';
import Oauth2Token from '@database/tables/oauth2Token.table';
import Password from '@database/tables/password.table';

class Login extends Model {
    id!: number;

    method!: AuthMethod;

    UserId!: number;

    Passwords?: Password[];

    Oauth2Tokens?: Oauth2Token[];
}

Login.init({
    method: {
        type: DataTypes.ENUM(...Object.values(AuthMethod)),
        allowNull: false,
        validate: Validators.enumValidateObject('method', Object.values(AuthMethod), false),
    },
}, tableConfigs);

export default Login;
