"use client";

import Header from "./components/Header";
import { ProtectedRoute } from "@/context/ProtectedRoute";
import { UserProvider } from "@/context/UserContext";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body>
				<UserProvider>
					<ProtectedRoute>
						<Header />
						<main>{children}</main>
					</ProtectedRoute>
				</UserProvider>
			</body>
		</html>
	);
}