/* eslint-disable camelcase */

export interface FacebookUserDataResponseData {
    id: number,
    first_name: string;
    last_name: string;
    email: string;
};

export interface GoogleUserDataResponseData {
    id: number,
    given_name: string;
    family_name: string;
    email: string;
}

export interface LinkedInUserDataResponseData {
    id: number,
    localizedFirstName: string;
    localizedLastName: string;
}

export interface LinkedInUserEmailResponseData {
    elements: [{
        "handle~": {
            emailAddress: string;
        }
    }]
}

export interface FacebookUserDataResponse {
    data: FacebookUserDataResponseData
};
