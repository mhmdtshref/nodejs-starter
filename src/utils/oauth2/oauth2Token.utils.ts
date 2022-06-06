import { LoginTable, Oauth2TokenTable } from "@database/tables"
import { Op } from "sequelize";

const getOauth2TokensByLoginIdsAndProvider = async (logins: LoginTable[], provider: string) => {
    const loginIds = logins.map(login => login.id);
    const oAuthTokens = await Oauth2TokenTable.findAll({
        where: {
            LoginId: { [Op.in]: loginIds },
            provider,
        },
    });
    return oAuthTokens;
}

export default {
    getOauth2TokensByLoginIdsAndProvider,
}