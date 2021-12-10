import axios from 'axios';
import { EmailProps, SendGridApiBodyProps } from '@types';

const emailRequestUrl = 'https://api.sendgrid.com/v3/mail/send';

/**
 * @memberof MailingUtils
 * @name sendEmail
 * @description Sends email to users
 * @param {EmailProps} emailProps Properties of the sending email (from, to and template details)
 * @returns {Promise<void>} Returns an empty promise
 */
export const sendEmail = async ({ fromEmail, toEmail, templateId, templateVariablesValues }: EmailProps): Promise<void> => {

    // Setup SendGrid request body:
    const emailRequestBody: SendGridApiBodyProps = {
        from: {
            email: fromEmail,
        },
        personalizations: [
            {
                to: [
                    { email: toEmail }
                ],
                dynamic_template_data: templateVariablesValues,
            }
        ],
        template_id: templateId,
    };

    // Setup Send Grid email request headers:
    const emailRequestHeaders = {
        Authorization: `Bearer ${process.env.SEND_GRID_API_KEY}`,
        'Content-Type': 'application/json',
    };

    // Send email request:
    const emailResponse = await axios.post(emailRequestUrl, emailRequestBody, { headers: emailRequestHeaders });

    // If response code success, return with success message:
    if (emailResponse.status !== 202) {
        throw new Error(emailResponse.data?.error?.message as string);
    }
}
