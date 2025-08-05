import { signup } from "./actions";
import "../login/login.css";

// This is a Server Component. 
// It can accept searchParams as a prop directly.
export default async function SignupPage({
	searchParams,
}: {
	searchParams: Promise<{ message: string }>;
}) {

	const message = (await searchParams).message;

	return (
		<div className="login-container">
			<div className="recruiter-message">
				<p><strong>Welcome To This Site Demo!</strong></p>
				<p>This site was made by Luke Flock</p>
				<p>Feel free to sign up with a fake email and password, test the sites features. The AI-powered recommendations feature is pretty nice, so try it out.</p>
				<p>For the best experience, rate a few games first, then head to the <strong>Recommendations</strong> tab to get personalized suggestions.</p>
			</div>
			<h2>Sign Up</h2>
			<form className="login-form" action={signup}>
				<input
					name="username"
					type="text"
					placeholder="Username"
					required
				/>
				<input
					name="email"
					type="email"
					placeholder="Email"
					required
				/>
				<input
					name="password"
					type="password"
					placeholder="Password"
					required
				/>
				<button type="submit">Sign Up</button>

				{message && (
					<p className="error-message">
						{message}
					</p>
				)}
			</form>

			<p className="switch-auth">
				Already have an account? <a href="/login">Login here</a>.
			</p>
		</div>
	);
}