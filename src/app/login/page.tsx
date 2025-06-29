import { login } from "./actions";
import "./login.css";


export default function LoginPage({
	searchParams,
} : {
	searchParams: {message: string}
}) {

	return (
		<div className="login-container">
			<h2>Login</h2>

			<form className="login-form" action={login}>
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
				<button type="submit">Login</button>
				{/* Display error message if it exists */}
                {searchParams.message && (
                    <p className="error-message">
                        {searchParams.message}
                    </p>
                )}
			</form>

			<p className="switch-auth">
				Don't have an account? <a href="/signup">Sign up here</a>.
			</p>
		</div>
	);
}