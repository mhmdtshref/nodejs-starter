import { Model as SequelizeModel, InitOptions } from 'sequelize';
import sequelize from './sequelize.database';

export class Model extends SequelizeModel {
    createdAt?: Date;

    updatedAt?: Date;

    deletedAt?: Date;
}

export const tableConfigs: InitOptions = {
    sequelize,
    paranoid: true,
    timestamps: true,
    underscored: true,
}
