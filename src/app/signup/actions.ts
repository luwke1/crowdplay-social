'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const username = formData.get('username') as string;

    // 1. Sign up the user with Supabase Auth
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
    });

    if (signUpError || !authData.user) {
        console.error('Sign up error:', signUpError?.message);
        redirect('/error?message=Could not authenticate user');
    }

    // 2. Create an associated entry in the public `profiles` table
    const { error: profileError } = await supabase
        .from('profiles')
        .insert({ id: authData.user.id, username: username });

    if (profileError) {
        console.error('Profile creation error:', profileError.message);
        redirect('/error?message=Could not create user profile');
    }

    revalidatePath('/', 'layout')
    redirect('/')
}