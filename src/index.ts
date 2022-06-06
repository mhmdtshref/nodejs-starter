import http from 'http';
import app from '@app';
import environments from '@environments';
import loggerUtils from '@logger';
import database from '@database/sequelize.database';
import { EnvironmentValidators } from '@validators';

const server = new http.Server(app);

const runServer = async () => {
    const environmentsValidationResults = EnvironmentValidators.validateEnvironments(environments);

    if (environmentsValidationResults.error) {
        throw new Error(environmentsValidationResults.error.message);
    }

    await database.authenticate();
    await database.sync({ force: false });

    const { host, port } = environments.server;

    server.listen(port, () => {
        const message = `Server is running on http://${host}:${port}`;

        // Log to info file log:
        loggerUtils.info(message)

        // Log to console:
        // eslint-disable-next-line no-console
        console.log(message);
    });
}

runServer();
