import { supabase, isSupabaseConfigured } from "./client";

export async function signUp(email: string, password: string, metaData: any) {
  if (!isSupabaseConfigured() || !supabase) {
    return { data: null, error: new Error("Supabase is not configured") };
  }
  return await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metaData,
    },
  });
}

export async function signIn(email: string, password: string) {
  if (!isSupabaseConfigured() || !supabase) {
    return { data: null, error: new Error("Supabase is not configured") };
  }
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
}

export async function signOut() {
  if (!isSupabaseConfigured() || !supabase) {
    return { error: new Error("Supabase is not configured") };
  }
  return await supabase.auth.signOut();
}

export async function resetPassword(email: string) {
  if (!isSupabaseConfigured() || !supabase) {
    return { data: null, error: new Error("Supabase is not configured") };
  }
  return await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
}

export async function getSession() {
  if (!isSupabaseConfigured() || !supabase) {
    return { data: { session: null }, error: new Error("Supabase is not configured") };
  }
  return await supabase.auth.getSession();
}

export function onAuthStateChange(callback: (event: any, session: any) => void) {
  if (!isSupabaseConfigured() || !supabase) {
    return { data: { subscription: { unsubscribe: () => {} } } };
  }
  return supabase.auth.onAuthStateChange(callback);
}

export async function signInWithGoogle() {
  if (!isSupabaseConfigured() || !supabase) {
    return { data: null, error: new Error("Supabase is not configured") };
  }
  return await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/dashboard`,
      queryParams: {
        prompt: 'select_account',
        access_type: 'offline',
      },
    },
  });
}

export async function fetchProfile(userId: string) {
  if (!isSupabaseConfigured() || !supabase) {
    return { data: null, error: new Error("Supabase is not configured") };
  }
  return await supabase.from("profiles").select("*").eq("id", userId).single();
}
