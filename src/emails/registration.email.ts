import environments from "@environments";

interface RegistrationEmailProps {
	name: string,
	verificationUrl: string,
}

/**
 * @memberof RegistrationHtml
 * @name registrationEmailHtmlGenerator
 * @description Generates registration email html
 * @param {RegistrationEmailProps} data Email details (user name and verification url)
 * @returns {string} Email html as string
 */
const registrationEmailHtmlGenerator = ({
	name,
	verificationUrl,
}: RegistrationEmailProps) => `
<div>
	<p>Hello ${name}</p>
	<p>Thank you for registring in ${environments.app.name}</p>
	<p><a href="${verificationUrl}">Click here to verify your email and account</a></p>
</div>
`;

export default registrationEmailHtmlGenerator;
