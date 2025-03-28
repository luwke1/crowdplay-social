import { supabase } from "../utils/supabase";

// Sign up function
export const signUp = async (email: string, password: string, username: string) => {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;

  // Create user profile in the `profiles` table
  const { error: profileError } = await supabase
    .from("profiles")
    .insert([{ id: data.user?.id, username }]);

  if (profileError) throw profileError;

  return data.user;
};

// Login function
export const login = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.user;
};

// Logout function
export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};


// Get the current user
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  console.log(user);
  if (error) throw error;
  return user;
};