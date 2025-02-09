"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Header from "./components/Header";
import { supabase } from "./utils/supabase";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<any>(null);
	const router = useRouter();
	const pathname = usePathname();

	// Fetch the user on initial load
	useEffect(() => {
		const fetchUser = async () => {
			const { data: { user } } = await supabase.auth.getUser();
			setUser(user);

			// If user is not logged in and not on allowed pages, redirect to login
			if (!user && pathname !== "/login" && pathname !== "/signup") {
				router.push("/login");
			}
		};
		fetchUser();
	}, [pathname]); // Re-run when route changes

	return (
		<html lang="en">
			<body>
				<Header />
				<main>{children}</main>
			</body>
		</html>
	);
}