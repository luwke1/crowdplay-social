"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import Image from "next/image";
import "./Header.css";
import type { User } from '@supabase/supabase-js';

// The component accepts server-rendered user as a prop
export default function Header({ user: serverUser }: { user: User | null }) {
    const [user, setUser] = useState<User | null>(serverUser);
    const router = useRouter();

    useEffect(() => {
        const supabase = createClient();
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
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
                <Image src="/search.svg" alt="Search" width={20} height={20} />
                <input onKeyDown={handleSearch} type="text" placeholder="Search..." />
            </div>
            <Link href="/">Games</Link>
            <Link href="/recommendations">Recommendations</Link>
            {user ? (
                <>
                    <Link href="/profile">Profile</Link>
                    <a href="/login" onClick={handleLogout}>Logout</a>
                </>
            ) : (
                <Link href="/login">Login</Link>
            )}
        </div>
    );
};