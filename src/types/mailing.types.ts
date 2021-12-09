export interface EmailProps {
    fromEmail: string;
    toEmail: string;
    templateId: string;
    templateVariablesValues: { [key: string]: string | number };
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
           dynamic_template_data: {
               [key: string]: string | number,
            }
    }[],
    // eslint-disable-next-line camelcase
    template_id: string,
}
