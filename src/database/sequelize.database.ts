import { Sequelize, Options } from 'sequelize';

const dbOptions: Options = {
    host: process.env.DB_SERVER_HOST,
    port: Number(process.env.DB_SERVER_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_USER_PASSWORD,
    database: process.env.DB_NAME,
    dialect: 'postgres',
    logging: Boolean(Number(process.env.DB_LOGGING)),
};

const sequelize = new Sequelize(dbOptions);

export default sequelize;
