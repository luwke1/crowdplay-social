'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { z } from 'zod';

export interface FormState {
    message: string;
    errors: {
        username?: string[];
        email?: string[];
        password?: string[];
    } | undefined;
}

// schema for validation using Zod
const SignupSchema = z.object({
    username: z.string()
        .min(3, { message: 'Username must be at least 3 characters long.' })
        .max(20, { message: 'Username must be no more than 20 characters long.' })
        .regex(/^[a-zA-Z0-9_]+$/, { message: 'Username can only contain letters, numbers, and underscores.' }),
    email: z.string().email({ message: 'Please enter a valid email address.' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters long.' }),
});


export async function signup(prevState: FormState, formData: FormData): Promise<FormState> {
    const supabase = await createClient()

    // 1. Validate the form data
    const validatedFields = SignupSchema.safeParse(
        Object.fromEntries(formData.entries())
    );

    if (!validatedFields.success) {
        return {
            message: "Validation failed. Please check the fields.",
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }

    const { username, email, password } = validatedFields.data;

    // 2. Check if username is already taken
    const { data: existingProfile } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .single();

    if (existingProfile) {
        return {
            message: 'Username is already taken. Please choose another one.',
            errors: {
                username: ['Username is already taken.']
            }
        };
    }

    // 3. Sign up the user with Supabase Auth
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
        return {
            message: signUpError.message,
            errors: undefined
        };
    }

    if (!authData.user) {
        return {
            message: 'Could not create user. Please try again.',
            errors: undefined
        };
    }

    // 4. Create the associated entry in the public profiles table
    const { error: profileError } = await supabase
        .from('profiles')
        .insert({ id: authData.user.id, username: username });

    if (profileError) {
        console.error('Profile creation error:', profileError.message);
        return {
            message: 'Could not create user profile after signup. Please contact support.',
            errors: undefined
        };
    }

    // 5. On success, revalidate cache and redirect
    revalidatePath('/', 'layout')
    redirect('/')
}
