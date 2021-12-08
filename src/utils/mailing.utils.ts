
interface EmailProps {
    form: string;
    to: string;
    templateId: string;
    templateVariablesValues: { [key: string]: string | number };
}

export const sendEmail = ({ form, to, templateId, templateVariablesValues } :EmailProps) => 
    // TODO: Use function params to send email.
     ({ form, to, templateId, templateVariablesValues })
