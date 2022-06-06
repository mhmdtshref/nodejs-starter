import { ConfigProps, OAuth2Provider, MailingServiceProviders } from "@types";

const Configs: ConfigProps = {
    mailing: MailingServiceProviders.SendGrid,               // Email service name to be used
    emailValidation: true,                                  // Enable or disable email validation process
    authentication: {                                       // Controlling authentication settings
        methods: {                                          // Listing authentication methods
            password: {},
            oauth2: {                       
                providers: [OAuth2Provider.facebook],
            },
        },
    },
};

export default Configs;
