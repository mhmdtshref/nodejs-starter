import { EmailProps, MailingServiceProviders } from '@types';
import Configs from '@configs';
import SendGrid from '@utils/mailing/sendGrid.utils';

const sendEmail = (props: EmailProps) => {
    let func: Function;
    switch (Configs.mailing) {
        case MailingServiceProviders.SendGrid:
            func = SendGrid.sendEmail;
            break;
        default:
            func = SendGrid.sendEmail;
    }
    return func(props);
}

export default {
    sendEmail,
}