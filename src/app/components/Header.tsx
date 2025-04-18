"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../utils/supabase";
import "./Header.css";

const Header = () => {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  // Fetch user authentication state
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    fetchUser();

    // Listen for authentication state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Handle logout and redirect
  const handleLogout = async (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault(); // Prevent default navigation behavior
    try {
      await supabase.auth.signOut();
      setUser(null);
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") { 
      const searchQuery = (event.target as HTMLInputElement).value;
      router.push(`/search?q=${searchQuery}`);
    }
  }

  return (
    <div className="header">
      <div className="search-bar">
        <img src="/search.svg" alt="" />
        <input onKeyDown={handleSearch} type="text" />
      </div>
      <a href="/">Games</a>
      <a href="/friends">Friends</a>
      <a href="/profile">Profile</a>

      {user ? (
        <a href="/login" onClick={handleLogout}>Logout</a>
      ) : (
        <a href="/signup">Sign Up</a>
      )}
    </div>
  );
};

export default Header;