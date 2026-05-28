import { supabase } from "./supabase.js";

export async function getExcursions(tripId) {
  const { data, error } = await supabase
    .from("excursions")
    .select("*")
    .eq("trip_id", tripId);

  if (error) console.error(error);
  return data || [];
}

export async function addExcursion(excursion) {
  const { data, error } = await supabase
    .from("excursions")
    .insert(excursion)
    .select()
    .single();

  if (error) console.error(error);
  return data;
}

export async function updateExcursion(id, updates) {
  const { data, error } = await supabase
    .from("excursions")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) console.error(error);
  return data;
}

export async function deleteExcursion(id) {
  return supabase.from("excursions").delete().eq("id", id);
}
