
export enum OAuth2Provider {
    facebook = 'facebook',
    google = 'google',
    linkedIn = 'linkedIn',
};

export enum AuthMethod {
    Password = 'password',
    OAuth2 = 'oauth2',
};

export interface UserTokenObject {
    id: number,
    firstName: string;
    lastName: string;
    birthDate: Date;
    expirationDate: Date;
    email: string;
};
