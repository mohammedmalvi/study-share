import { supabase, isSupabaseConfigured } from "./client";

/**
 * Resolves the base URL for auth redirects.
 * Uses NEXT_PUBLIC_SITE_URL if set, otherwise falls back to the hardcoded
 * production Vercel URL. In local development, uses window.location.origin.
 */
export function getURL(): string {
  let url =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://study-share-mohammed-malvis-projects.vercel.app";

  // If running locally in development, override with window origin
  if (typeof window !== "undefined" && window.location.hostname === "localhost") {
    url = window.location.origin;
  }

  // Ensure https protocol and trailing slash formatting
  url = url.startsWith("http") ? url : `https://${url}`;
  url = url.endsWith("/") ? url : `${url}/`;
  return url;
}

export async function signUp(email: string, password: string, metaData: any) {
  if (!isSupabaseConfigured() || !supabase) {
    return { data: null, error: new Error("Supabase is not configured") };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metaData,
    },
  });

  if (error) {
    return { data: null, error };
  }

  // If Supabase created the user but didn't return an active session,
  // immediately sign in with password to guarantee an active session.
  if (!data.session) {
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      return { data: null, error: loginError };
    }

    return { data: loginData, error: null };
  }

  return { data, error: null };
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
    redirectTo: `${getURL()}reset-password`,
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
  const redirectTarget = `${getURL()}auth/callback`;
  console.log("OAuth Redirect Target:", redirectTarget);

  return await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: redirectTarget,
      queryParams: { prompt: "select_account" },
    },
  });
}

export async function fetchProfile(userId: string) {
  if (!isSupabaseConfigured() || !supabase) {
    return { data: null, error: new Error("Supabase is not configured") };
  }
  return await supabase.from("profiles").select("*").eq("id", userId).single();
}
