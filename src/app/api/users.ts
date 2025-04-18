import {supabase} from "@/utils/supabase";

export const getIdByUsername = async (username: string) => {
    try {
        const {data, error} = await supabase
            .from("profiles")
            .select("id")
            .eq("username", username)
            .single();

        if (error) throw error;

        return data.id;
    } catch (err) {
        console.error("Error fetching user ID:", err);
        throw err;
    }
}