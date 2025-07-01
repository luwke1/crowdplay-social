import { login } from "./actions";
import "./login.css";

export default function LoginPage({
    searchParams,
} : {
    searchParams: {message: string}
}) {
    return (
        <div className="login-container">
            <div className="recruiter-message">
                <p><strong>Welcome To This Site Demo!</strong></p>
                <p>Feel free to sign up with a fake email and password to test the site&apos;s features. The AI-powered recommendations feature is a highlight!</p>
                <p>For the best experience, rate a few games first, then head to the <strong>Recommendations</strong> tab to get personalized suggestions.</p>
            </div>
            <h2>Login</h2>
            <form className="login-form" action={login}>
                <input name="email" type="email" placeholder="Email" required />
                <input name="password" type="password" placeholder="Password" required />
                <button type="submit">Login</button>
                {searchParams.message && (
                    <p className="error-message">
                        {searchParams.message}
                    </p>
                )}
            </form>
            <p className="switch-auth">
                {/* Fixed unescaped apostrophe */}
                Don&apos;t have an account? <a href="/signup">Sign up here</a>.
            </p>
        </div>
    );
}