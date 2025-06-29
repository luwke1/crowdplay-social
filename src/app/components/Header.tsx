"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import "./Header.css";
import type { User } from '@supabase/supabase-js';

// The component now accepts the server-rendered user as a prop
export default function Header({ user: serverUser }: { user: User | null }) {
    const [user, setUser] = useState<User | null>(serverUser);
    const router = useRouter();

    useEffect(() => {
        const supabase = createClient();
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user ?? null);
            router.refresh();
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [router]);


    const handleLogout = async (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        const supabase = createClient();
        await supabase.auth.signOut();
        // The onAuthStateChange listener above will handle the UI update and refresh.
        router.push('/login');
    };

    const handleSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            const searchQuery = (event.target as HTMLInputElement).value;
            router.push(`/search?q=${searchQuery}`);
        }
    };

    return (
        <div className="header">
            <div className="search-bar">
                <img src="/search.svg" alt="Search" />
                <input onKeyDown={handleSearch} type="text" placeholder="Search..." />
            </div>
            <a href="/">Games</a>
            <a href="/recommendations">Recommendations</a>
            {user ? (
                <>
                    <a href="/profile">Profile</a>
                    <a href="/login" onClick={handleLogout}>Logout</a>
                </>
            ) : (
                <a href="/login">Login</a>
            )}
        </div>
    );
};