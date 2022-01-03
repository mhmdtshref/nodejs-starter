/* eslint-disable no-unused-vars */

export enum UserStatus {
    pendingVerification = 'pending verification',
    active = 'active',
    disabled = 'disabled',
};

export interface UserData {
    id: number
    firstName: string
    lastName: string
    birthDate: Date
    email: string
    password: string
    passwordHash: string
    status: UserStatus
};

export interface UserPublicData {
    id: number
    firstName: string
    lastName: string
    birthDate: Date
    email: string
}