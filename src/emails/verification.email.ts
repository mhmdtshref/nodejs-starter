interface VerificationEmailProps {
	name: string,
	verificationUrl: string,
}

/**
 * @memberof EmailVerificationEmail
 * @name verificationEmailHtmlGenerator
 * @description Generates verification email html
 * @param {VerificationEmailProps} data Email details (name and verification url)
 * @returns {string} Email html as string
 */
const verificationEmailHtmlGenerator = ({
	name,
	verificationUrl,
}: VerificationEmailProps) => `
<div>
	<p>Hello ${name}</p>
	<p><a href="${verificationUrl}">Click here to verify your email and account</a></p>
</div>
`;

export default verificationEmailHtmlGenerator;
