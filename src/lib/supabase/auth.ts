import { supabase } from './client';
import type { AuthResult } from '@/types/board';

export async function signUpWithEmail(email: string, password: string, name: string): Promise<AuthResult> {
  try {
    // Create auth user in Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data.user) {
      return { success: false, error: 'Failed to create user' };
    }

    return { success: true, userId: data.user.id, email: data.user.email || '' };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Sign up failed' };
  }
}

export async function signInWithEmail(email: string, password: string): Promise<AuthResult> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data.user) {
      return { success: false, error: 'Failed to sign in' };
    }

    return { success: true, userId: data.user.id, email: data.user.email || '' };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Sign in failed' };
  }
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}

export async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function onAuthStateChange(callback: (userId: string | null) => void) {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((event, session) => {
    callback(session?.user?.id || null);
  });

  return subscription;
}
