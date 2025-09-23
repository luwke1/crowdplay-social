'use client'

import { signup, type FormState } from "./actions";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import "../login/login.css";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button type="submit" aria-disabled={pending}>
            {pending ? 'Signing Up...' : 'Sign Up'}
        </button>
    );
}

export default function SignupPage() {
    const initialState: FormState = { message: '', errors: undefined };
    const [state, formAction] = useActionState(signup, initialState);

    return (
        <div className="login-container">
            <div className="recruiter-message">
                <p><strong>Welcome To This Site Demo!</strong></p>
                <p>This site was made by Luke Flock</p>
                <p>Feel free to sign up with a fake email and password, test the sites features. The AI-powered recommendations feature is pretty nice, so try it out.</p>
                <p>For the best experience, rate a few games first, then head to the <strong>Recommendations</strong> tab to get personalized suggestions.</p>
            </div>
            <h2>Sign Up</h2>
            <form className="login-form" action={formAction}>
                <input
                    name="username"
                    type="text"
                    placeholder="Username"
                    required
                />
                {state.errors?.username && (
                    <p className="error-message">{state.errors.username[0]}</p>
                )}

                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    required
                />
                {state.errors?.email && (
                     <p className="error-message">{state.errors.email[0]}</p>
                )}

                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    required
                />
                {state.errors?.password && (
                    <p className="error-message">{state.errors.password[0]}</p>
                )}

                <SubmitButton />

                {state.message && !state.errors && (
                     <p className="error-message">
                         {state.message}
                     </p>
                )}
            </form>

            <p className="switch-auth">
                Already have an account? <a href="/login">Login here</a>.
            </p>
        </div>
    );
}