"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUp } from "@/api/auth";
import "../login/login.css";

export default function SignupPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // Handle sign-up form submission
    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await signUp(email, password, username);
            router.push("/");
        } catch (err: any) {
            setError(err.message || "Something went wrong. Please try again.");
        }

        setLoading(false);
    };

    return (
        <div className="login-container">
            <h2>Sign Up</h2>
            <form onSubmit={handleSignup} className="login-form">
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
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
                    {loading ? "Signing up..." : "Sign Up"}
                </button>
                {error && <p className="error">{error}</p>}
            </form>

            <p className="switch-auth">
                Already have an account? <a href="/login">Login here</a>.
            </p>
        </div>
    );
}