import { createClient } from "@/lib/supabase/server";
import type { BirdSex, BirdStatus, Database } from "@/lib/types/database.types";

export interface BirdFilters {
  speciesId?: string;
  sex?: BirdSex;
  status?: BirdStatus;
}

const BIRD_WITH_RELATIONS_SELECT = `
  *,
  species:species_id ( id, code, name_nl ),
  father:father_id ( id, name, ring_number, ring_year, ring_color, sex ),
  mother:mother_id ( id, name, ring_number, ring_year, ring_color, sex )
`;

export interface BirdRelationSummary {
  id: string;
  name: string | null;
  ring_number: string | null;
  ring_year: number | null;
  ring_color: string | null;
  sex: BirdSex;
}

/**
 * Vogelrij met de opgehaalde relaties (soort, vader, moeder). De
 * hand-geschreven Database-types hierboven bevatten geen Relationships-
 * metadata (die normaal door `supabase gen types` gegenereerd wordt), dus
 * supabase-js kan het resultaat van deze embedded select niet automatisch
 * typeren. We casten het resultaat daarom expliciet naar dit type — zodra
 * een live project gekoppeld is en de types gegenereerd worden, kan deze
 * cast vervangen worden door de dan correct afgeleide types.
 */
export type BirdWithRelations = Database["public"]["Tables"]["birds"]["Row"] & {
  species: { id: string; code: string; name_nl: string } | null;
  father: BirdRelationSummary | null;
  mother: BirdRelationSummary | null;
};

export async function listBirds(filters: BirdFilters = {}) {
  const supabase = await createClient();
  let query = supabase
    .from("birds")
    .select(BIRD_WITH_RELATIONS_SELECT)
    .order("created_at", { ascending: false });

  if (filters.speciesId) query = query.eq("species_id", filters.speciesId);
  if (filters.sex) query = query.eq("sex", filters.sex);
  if (filters.status) query = query.eq("status", filters.status);

  const { data, error } = await query;
  if (error) throw error;
  return data as unknown as BirdWithRelations[];
}

export async function getBirdById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("birds")
    .select(BIRD_WITH_RELATIONS_SELECT)
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as unknown as BirdWithRelations;
}

/** Compacte lijst voor pickers (bv. vader/moeder-selectie, koppel-vorming). */
export async function listBirdOptions(filters: BirdFilters = {}) {
  const supabase = await createClient();
  let query = supabase
    .from("birds")
    .select("id, name, ring_number, ring_year, sex, species_id, status")
    .order("ring_year", { ascending: false });

  if (filters.speciesId) query = query.eq("species_id", filters.speciesId);
  if (filters.sex) query = query.eq("sex", filters.sex);
  if (filters.status) query = query.eq("status", filters.status);

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getOffspringOf(birdId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("birds")
    .select("id, name, ring_number, ring_year, ring_color, sex, species_id")
    .or(`father_id.eq.${birdId},mother_id.eq.${birdId}`)
    .order("ring_year", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getOffspringOfBrood(broodId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("birds")
    .select("id, name, ring_number, ring_year, ring_color, sex, species_id")
    .eq("brood_id", broodId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}
