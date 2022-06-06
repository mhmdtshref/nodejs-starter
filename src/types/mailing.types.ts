/* eslint-disable camelcase */

export enum MailingServiceProviders {
    SendGrid = 'sendgrid',
}

interface EmailUser {
    name: string,
    email: string,
}
export interface EmailProps {
    from: EmailUser;
    to: EmailUser;
    subject: string;
    html: string;
    replyTo?: EmailUser;
}

interface SendGridPersonalization {
    to: EmailUser[],
    subject: string,
}

interface SendGridContent {
    type: 'text/html' | 'text/plain',
    value: string
}

export interface SendGridApiBodyProps {
    personalizations: SendGridPersonalization[],
    content: SendGridContent[],
    from: EmailUser,
    reply_to: EmailUser,
}
