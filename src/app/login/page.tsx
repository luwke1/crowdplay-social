"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/api/auth";
import "./login.css";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	// Handle login form submission
	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			await login(email, password);
			router.push("/");
		} catch (err: any) {
			setError(err.message || "Something went wrong. Please try again.");
		}

		setLoading(false);
	};

	return (
		<div className="login-container">
			<h2>Login</h2>
			<form onSubmit={handleLogin} className="login-form">
				<input
					type="email"
					placeholder="Email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
				/>
				<input
					type="password"
					placeholder="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
				/>
				<button type="submit" disabled={loading}>
					{loading ? "Logging in..." : "Login"}
				</button>
				{error && <p className="error">{error}</p>}
			</form>

			{/* Sign Up Link */}
			<p className="switch-auth">
				Don't have an account? <a href="/signup">Sign up here</a>.
			</p>
		</div>
	);
}