import UserTable from '@database/tables/user.table';
import LoginTable from '@database/tables/login.table';
import ResetPassword from './tables/resetPassword.table';

UserTable.hasMany(LoginTable);
LoginTable.belongsTo(UserTable);

LoginTable.hasMany(ResetPassword);
ResetPassword.belongsTo(LoginTable);
