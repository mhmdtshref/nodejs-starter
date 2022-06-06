import { Sequelize, Options } from 'sequelize';
import environments from '@environments';

const sequelize = new Sequelize(environments.database as Options);

export default sequelize;
