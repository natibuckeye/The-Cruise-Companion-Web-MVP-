import { supabase } from "./supabase.js";

export async function ensureUserProfile() {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth?.user) return null;

  const authUser = auth.user;

  // Check if profile exists
  const { data: existing } = await supabase
    .from("users")
    .select("*")
    .eq("auth_user_id", authUser.id)
    .single();

  if (existing) return existing;

  // Create profile
  const { data, error } = await supabase
    .from("users")
    .insert({
      auth_user_id: authUser.id,
      email: authUser.email,
      display_name: authUser.user_metadata?.full_name || null,
      photo_url: authUser.user_metadata?.avatar_url || null
    })
    .select()
    .single();

  if (error) console.error(error);
  return data;
}
