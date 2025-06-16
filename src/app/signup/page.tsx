import { signup } from "./actions";
import "../login/login.css";

// This is a Server Component. 
// It can accept searchParams as a prop directly.
export default async function SignupPage({
	searchParams,
}: {
	searchParams: { message: string };
}) {

	const message = searchParams.message;

	return (
		<div className="login-container">
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