import { createClient } from "@/lib/supabase/server";
import type { Database, PairStatus } from "@/lib/types/database.types";
import type { BirdRelationSummary } from "@/lib/queries/birds";

const PAIR_WITH_BIRDS_SELECT = `
  *,
  male_bird:male_bird_id ( id, name, ring_number, ring_year, ring_color, sex, species_id ),
  female_bird:female_bird_id ( id, name, ring_number, ring_year, ring_color, sex, species_id )
`;

export type PairWithBirds = Database["public"]["Tables"]["pairs"]["Row"] & {
  male_bird: (BirdRelationSummary & { species_id: string }) | null;
  female_bird: (BirdRelationSummary & { species_id: string }) | null;
};

export async function listPairs(filters: { status?: PairStatus } = {}) {
  const supabase = await createClient();
  let query = supabase
    .from("pairs")
    .select(PAIR_WITH_BIRDS_SELECT)
    .order("started_at", { ascending: false });

  if (filters.status) query = query.eq("status", filters.status);

  const { data, error } = await query;
  if (error) throw error;
  return data as unknown as PairWithBirds[];
}

export async function getPairById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("pairs")
    .select(PAIR_WITH_BIRDS_SELECT)
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as unknown as PairWithBirds;
}

/** Compacte lijst voor pickers (bv. broedsel aanmaken bij een koppel). */
export async function listPairOptions(filters: { status?: PairStatus } = {}) {
  const supabase = await createClient();
  let query = supabase
    .from("pairs")
    .select(PAIR_WITH_BIRDS_SELECT)
    .order("started_at", { ascending: false });

  if (filters.status) query = query.eq("status", filters.status);

  const { data, error } = await query;
  if (error) throw error;
  return data as unknown as PairWithBirds[];
}
