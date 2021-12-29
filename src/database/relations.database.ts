import { UserTable, LoginTable, ResetPassword } from '@database/tables';

UserTable.hasMany(LoginTable);
LoginTable.belongsTo(UserTable);

LoginTable.hasMany(ResetPassword);
ResetPassword.belongsTo(LoginTable);
