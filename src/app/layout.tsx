import Header from "./components/Header";
import "./globals.css";
import { createClient } from "@/utils/supabase/server";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    // Create a Supabase client for the server
    const supabase = await createClient();

    // Get the current user session
    const { data: { user } } = await supabase.auth.getUser();

    return (
        <html lang="en">
            <body>
                <Header user={user} />
                <main>{children}</main>
            </body>
        </html>
    );
}