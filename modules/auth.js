// ===============================
// AUTH MODULE — Supabase Wrapper
// ===============================

import { supabase } from "./supabase.js";

// Get the currently logged‑in user
export async function getUser() {
  const {
    data: { user }
  } = await supabase.auth.getUser();

  return user;
}

// Sign in with email + password
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) console.error(error);
  return data?.user || null;
}

// Sign out
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) console.error(error);
}
