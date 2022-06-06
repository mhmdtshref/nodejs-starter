import UserTable from '@database/tables/user.table';
import LoginTable from '@database/tables/login.table';
import PasswordTable from '@database/tables/password.table';
import ResetPasswordTable from '@database/tables/resetPassword.table';
import Oauth2TokenTable from '@database/tables/oauth2Token.table';
import sequelizeDatabaseImport from '@database/sequelize.database';
import '../relations.database';

const sequelizeDatabase = sequelizeDatabaseImport;

export {
    UserTable,
    LoginTable,
    PasswordTable,
    ResetPasswordTable,
    Oauth2TokenTable,
    sequelizeDatabase,
};
