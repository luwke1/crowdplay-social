"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import "./Header.css";

type User = {
    id: string;
    email?: string;
};

const Header = () => {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };

        getUser();

        // Set up a listener for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user ?? null);
            router.refresh(); // Refresh router to reflect server-side changes
        });

        // Cleanup the listener on unmount
        return () => {
            subscription.unsubscribe();
        };
    }, [router, supabase]);

    const handleLogout = async (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        await supabase.auth.signOut();
        // The listener will handle state update and router refresh
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
            {user && <a href="/profile">Profile</a>}

            {user ? (
                <a href="/login" onClick={handleLogout}>Logout</a>
            ) : (
                <>
                  <a href="/login">Login</a>
                </>
            )}
        </div>
    );
};

export default Header;