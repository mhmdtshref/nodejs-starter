import UserTable from '@database/tables/user.table';
import LoginTable from '@database/tables/login.table';
import PasswordTable from '@database/tables/password.table';
import ResetPasswordTable from '@database/tables/resetPassword.table';
import Oauth2TokenTable from '@database/tables/oauth2Token.table';

// User <=> Login
UserTable.hasMany(LoginTable);
LoginTable.belongsTo(UserTable);

// Login <=> Password
LoginTable.hasMany(PasswordTable);
PasswordTable.belongsTo(LoginTable);

// Login <=> ResetPassword 
LoginTable.hasMany(ResetPasswordTable);
ResetPasswordTable.belongsTo(LoginTable);

// User <=> Oauth2Token
LoginTable.hasMany(Oauth2TokenTable);
Oauth2TokenTable.belongsTo(LoginTable);
