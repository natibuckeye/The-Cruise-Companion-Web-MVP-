// ===============================
// Supabase Client (Frontend Safe)
// ===============================

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// IMPORTANT:
// Replace these with YOUR actual Supabase values
// (Project URL + anon public key)
const SUPABASE_URL = "https://YOUR-PROJECT-ID.supabase.co";
const SUPABASE_ANON_KEY = "YOUR-ANON-PUBLIC-KEY";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Helper: get current user
export async function getCurrentUser() {
  const { data } = await supabase.auth.getUser();
  return data?.user || null;
}

// Helper: sign in with magic link
export async function signInWithEmail(email) {
  return supabase.auth.signInWithOtp({ email });
}

// Helper: sign out
export async function signOut() {
  return supabase.auth.signOut();
}
