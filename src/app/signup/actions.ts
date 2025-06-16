'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const username = formData.get('username') as string;

    // 1. Check if username is already taken
    const { data: existingProfile, error: usernameError } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .single();

    if (existingProfile) {
        // Redirect back to signup page with an error message
        redirect('/signup?message=Username already taken');
    }

    // 2. Sign up the user with Supabase Auth
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                username: username,
            }
        }
    });

    if (signUpError) {
        console.error('Sign up error:', signUpError.message);
        redirect(`/signup?message=${signUpError.message}`);
    }

    if (!authData.user) {
         redirect('/signup?message=Could not create user. Please try again.');
    }

    // 3. Create the associated entry in the public profiles table
    const { error: profileError } = await supabase
        .from('profiles')
        .insert({ id: authData.user.id, username: username });

    if (profileError) {
        console.error('Profile creation error:', profileError.message);
        // I need to implement something to handle this critical error, cause they have an auth profile but not a public profile.
        redirect('/error?message=Could not create user profile after signup.');
    }

    revalidatePath('/', 'layout')
    redirect('/')
}