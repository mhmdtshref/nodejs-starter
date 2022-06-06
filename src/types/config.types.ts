import { AuthMethod, OAuth2Provider } from "./login.types";
import { MailingServiceProviders } from "./mailing.types";

type MailingServices = MailingServiceProviders;
type Authentication = {
    methods: {
        [key in AuthMethod]: {
            providers?: OAuth2Provider[],
        }
    },
};

export interface ConfigProps {
    mailing: MailingServices,
    emailValidation: boolean,
    authentication: Authentication,
}