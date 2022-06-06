import { Model, tableConfigs } from '@database/settings.database';
import { OAuth2Provider } from '@types';
import { DataTypes } from 'sequelize';
import Validators from '../validator.database';

class Oauth2Token extends Model {
    id!: number;

    providerUserId!: string;

    userAgent?: string;

    provider!: OAuth2Provider;

    ipAddress!: string;

    LoginId?: number;
}

Oauth2Token.init({
    providerUserId: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: Validators.stringValidateObject('providerUserId', false),
    },
    userAgent: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: Validators.stringValidateObject('userAgent', true),
    },
    ipAddress: {
        type: DataTypes.STRING(63),
        allowNull: true,
        validate: Validators.urlValidateObject('ipAddress', true),
    },
    provider: {
        type: DataTypes.ENUM(...Object.values(OAuth2Provider)),
        allowNull: false,
        validate: Validators.enumValidateObject('provider', Object.values(OAuth2Provider), false),
    }
}, tableConfigs);

export default Oauth2Token;
