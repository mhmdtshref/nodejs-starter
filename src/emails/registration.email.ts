interface RegistrationEmailProps {
	name: string,
	verificationUrl: string,
}

export default ({
	name,
	verificationUrl,
}: RegistrationEmailProps) => `
<div>
	<p>Hello ${name}</p>
	<p>Thank you for registring in ${process.env.APP_NAME}</p>
	<p><a href="${verificationUrl}">Click here to verify your email and account</a></p>
</div>
`;
