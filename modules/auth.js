import { supabase } from "./supabase.js";

export async function login(email) {
  const { error } = await supabase.auth.signInWithOtp({ email });
  return error;
}

export async function logout() {
  await supabase.auth.signOut();
}

export async function onAuthChange(callback) {
  supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user || null);
  });
}
