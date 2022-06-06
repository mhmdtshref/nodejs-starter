import axios from 'axios';
import { EmailProps, SendGridApiBodyProps } from '@types';
import ErrorUtils from '@utils/error.utils';
import environments from '@environments';

const emailRequestUrl = 'https://api.sendgrid.com/v3/mail/send';

/**
 * @memberof MailingUtils
 * @name sendEmail
 * @description Sends email to users
 * @param {EmailProps} emailProps Properties of the sending email (from, to and template details)
 * @returns {Promise<void>} Returns an empty promise
 */
const sendEmail = async ({ from, to, subject, html, replyTo }: EmailProps): Promise<void> => {

    // Setup SendGrid request body:
    const emailRequestBody: SendGridApiBodyProps = {
        personalizations: [
            {
                to: [to],
                subject,
            },
        ],
        content: [
            {
                type: 'text/html',
                value: html
            },
        ],
        from,
        reply_to: replyTo || from,
    };

    // Setup Send Grid email request headers:
    const emailRequestHeaders = {
        Authorization: `Bearer ${environments.mailing.providers.sendgrid.apiKey}`,
        'Content-Type': 'application/json',
    };

    // Send email request:
    const emailResponse = await axios.post(emailRequestUrl, emailRequestBody, { headers: emailRequestHeaders });

    // If response code success, return with success message:
    if (emailResponse.status !== 202) {
        throw ErrorUtils.getServerError(emailResponse.data?.error?.message || 'Unknown error');
    }

}

export default {
    sendEmail,
};
