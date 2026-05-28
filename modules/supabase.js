// ===============================
// Supabase Client (Frontend Safe)
// ===============================

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Replace with your actual project values
const SUPABASE_URL = "https://YOUR-PROJECT-ID.supabase.co";
const SUPABASE_ANON_KEY = "YOUR-ANON-PUBLIC-KEY";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Current user
export async function getCurrentUser() {
  const { data } = await supabase.auth.getUser();
  return data?.user || null;
}

// Magic link login
export async function signInWithEmail(email) {
  return supabase.auth.signInWithOtp({ email });
}

// Logout
export async function signOut() {
  return supabase.auth.signOut();
}
