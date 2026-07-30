import { createClient } from "@/lib/supabase/server";

export async function getSpeciesList() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("species")
    .select("*")
    .order("name_nl");

  if (error) throw error;
  return data;
}

export async function getSpeciesById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("species")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}
