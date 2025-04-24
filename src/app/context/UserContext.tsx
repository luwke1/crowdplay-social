"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "@/api/auth";

type User = any;

const UserContext = createContext<{ user: User | null, loading: boolean }>({
    user: null,
    loading: true,
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getUser = async () => {
            const user = await getCurrentUser();
            setUser(user ?? null);
            setLoading(false);
        };

        getUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, loading }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);