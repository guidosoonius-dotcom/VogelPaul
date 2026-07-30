import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/types/database.types";
import type { BirdRelationSummary } from "@/lib/queries/birds";

const BROOD_WITH_PAIR_SELECT = `
  *,
  species:species_id ( id, code, name_nl ),
  pair:pair_id (
    id,
    male_bird:male_bird_id ( id, name, ring_number, ring_year, sex ),
    female_bird:female_bird_id ( id, name, ring_number, ring_year, sex )
  )
`;

export type BroodWithPair = Database["public"]["Tables"]["broods"]["Row"] & {
  species: { id: string; code: string; name_nl: string } | null;
  pair: {
    id: string;
    male_bird: BirdRelationSummary | null;
    female_bird: BirdRelationSummary | null;
  } | null;
};

export async function listBroods(filters: { pairId?: string } = {}) {
  const supabase = await createClient();
  let query = supabase
    .from("broods")
    .select(BROOD_WITH_PAIR_SELECT)
    .order("clutch_started_at", { ascending: false, nullsFirst: false });

  if (filters.pairId) query = query.eq("pair_id", filters.pairId);

  const { data, error } = await query;
  if (error) throw error;
  return data as unknown as BroodWithPair[];
}

export async function getBroodById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("broods")
    .select(BROOD_WITH_PAIR_SELECT)
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as unknown as BroodWithPair;
}
