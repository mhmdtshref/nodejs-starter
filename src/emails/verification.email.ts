interface VerificationEmailProps {
	name: string,
	verificationUrl: string,
}

export default ({
	name,
	verificationUrl,
}: VerificationEmailProps) => `
<div>
	<p>Hello ${name}</p>
	<p><a href="${verificationUrl}">Click here to verify your email and account</a></p>
</div>
`;
