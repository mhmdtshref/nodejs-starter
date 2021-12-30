
interface EmailContent {
    type: string,
    value: string,
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

export interface SendGridApiBodyProps {
    from: {
        email: string,
     },
     personalizations:  {
           to: [
              {
                 email: string,
              },
           ],
           // eslint-disable-next-line camelcase
           dynamic_template_data?: {
               [key: string]: string | number,
            }
    }[],
    // eslint-disable-next-line camelcase
    template_id?: string,
    content?: EmailContent,
}
