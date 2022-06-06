
import { AuthMethod, OAuth2Provider } from "./login.types"

export enum UserStatus {
    pendingVerification = 'pending verification',
    active = 'active',
    disabled = 'disabled',
};

export interface UserData {
    id?: number
    firstName: string
    lastName: string
    email: string
    birthDate: Date
    status?: UserStatus
};

export interface UserRegistrationData {
    firstName: string;
    lastName: string;
    email: string;
    birthDate?: Date;
    providerUserId?: string;
}

export interface UserPublicData {
    id: number
    firstName: string
    lastName: string
    birthDate: Date
    email: string
}

export interface UserRegisterRequestBody {
    method: AuthMethod
    provider?: OAuth2Provider
    data: {
        firstName: string
        lastName: string
        email: string
        birthDate: Date
        password?: string
        code?: string
    }
}

export interface UserLoginRequestBody {
    method: AuthMethod
    provider?: OAuth2Provider
    credentials: {
        email?: string;
        password?: string;
        code?: string;
    }
}
