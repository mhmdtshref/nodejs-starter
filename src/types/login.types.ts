/* eslint-disable no-unused-vars */

export enum LoginProvider {
    local = 'local',
};

export interface UserTokenObject {
    id: number,
    firstName: string;
    lastName: string;
    birthDate: Date;
    expirationDate: Date;
    email: string;
};
