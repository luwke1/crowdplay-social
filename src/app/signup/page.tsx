"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase";
import "../login/login.css";

export default function SignupPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // Handle sign up form submission
    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Sign up the user
        try {
            const { data, error } = await supabase.auth.signUp({ email, password });

            // Handle sign up error
            if (error) {
                setError(error.message);
                setLoading(false);
                return;
            }

            // Create user profile in the `profiles` table
            const userId = data.user?.id;
            if (userId) {
                const { error: profileError } = await supabase
                    .from("profiles")
                    .insert([{ id: userId, username }]);

                if (profileError) {
                    setError(profileError.message);
                    setLoading(false);
                    return;
                }
            }

            // Redirect user to home after successful signup
            router.push("/");
        } catch (err) {
            setError("Something went wrong. Please try again.");
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

            {/* Login Link */}
            <p className="switch-auth">
                Already have an account? <a href="/login">Login here</a>.
            </p>
        </div>
    );
}