"use client";

import { useUser } from "./UserContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

const PUBLIC_ROUTES = ["/login", "/signup"];

// This component checks if the user is logged in and redirects them to the login page if they are not.
export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, loading } = useUser();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (loading) return;

        const isPublic = PUBLIC_ROUTES.includes(pathname);

        if (!user && !isPublic) {
            router.push("/login");
        }

        if (user && isPublic) {
            router.push("/home");
        }
    }, [user, loading, pathname]);

    if (loading) return null;

    return <>{children}</>;
};