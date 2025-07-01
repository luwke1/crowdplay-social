"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import Image from "next/image";
import "./Header.css";
import type { User } from "@supabase/supabase-js";

// Header takes server-rendered user as a prop
export default function Header({ user: serverUser }: { user: User | null }) {
  const [user, setUser] = useState<User | null>(serverUser);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setUser(serverUser);
  }, [serverUser]);

  useEffect(() => {
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
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
    router.push("/login");
  };

  const handleSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      const searchQuery = (event.target as HTMLInputElement).value;
      router.push(`/search?q=${searchQuery}`);
      setIsMenuOpen(false); // Close menu after search
    }
  };

  // Close the menu when a link is clicked
  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-logo">
        <Link href="/" onClick={handleLinkClick}>
          CrowdPlay
        </Link>
      </div>

      <button className="hamburger-menu" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        <Image src="/menu-icon.svg" alt="Menu" width={30} height={30} />
      </button>

      {/* Navigation container */}
      <div className={`header-nav ${isMenuOpen ? "open" : ""}`}>
        <div className="search-bar">
          <Image src="/search.svg" alt="Search" width={20} height={20} />
          <input onKeyDown={handleSearch} type="text" placeholder="Search..." />
        </div>
        <Link href="/" onClick={handleLinkClick}>
          Games
        </Link>
        <Link href="/recommendations" onClick={handleLinkClick}>
          Recommendations
        </Link>
        {user ? (
          <>
            <Link href="/profile" onClick={handleLinkClick}>
              Profile
            </Link>
            <a href="/login" onClick={(e) => {
                handleLogout(e);
                handleLinkClick();
              }}
            >
              Logout
            </a>
          </>
        ) : (
          <Link href="/login" onClick={handleLinkClick}>
            Login
          </Link>
        )}
      </div>
    </header>
  );
}