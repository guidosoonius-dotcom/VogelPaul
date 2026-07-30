import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/types/database.types";
import type { BirdRelationSummary } from "@/lib/queries/birds";

const COMPETITION_WITH_BIRD_SELECT = `
  *,
  bird:bird_id ( id, name, ring_number, ring_year, ring_color, sex )
`;

export type CompetitionResultWithBird =
  Database["public"]["Tables"]["competition_results"]["Row"] & {
    bird: BirdRelationSummary | null;
  };

export async function listCompetitionResults(filters: { birdId?: string } = {}) {
  const supabase = await createClient();
  let query = supabase
    .from("competition_results")
    .select(COMPETITION_WITH_BIRD_SELECT)
    .order("show_date", { ascending: false });

  if (filters.birdId) query = query.eq("bird_id", filters.birdId);

  const { data, error } = await query;
  if (error) throw error;
  return data as unknown as CompetitionResultWithBird[];
}

export async function getCompetitionResultById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("competition_results")
    .select(COMPETITION_WITH_BIRD_SELECT)
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as unknown as CompetitionResultWithBird;
}

export interface PrizeShowcaseFilters {
  year?: number;
  speciesId?: string;
}

const PRIZE_SHOWCASE_SELECT = `
  id, show_name, show_date, ranking, points, photo_url,
  bird:bird_id!inner ( id, name, ring_number, ring_year, ring_color, sex, species_id )
`;

export type PrizeShowcaseEntry = {
  id: string;
  show_name: string;
  show_date: string;
  ranking: string | null;
  points: number | null;
  photo_url: string | null;
  bird: (BirdRelationSummary & { species_id: string }) | null;
};

/** Recente/topresultaten voor het dashboard, optioneel gefilterd op jaar en soort. */
export async function getPrizeShowcase(
  filters: PrizeShowcaseFilters = {},
  limit = 10,
) {
  const supabase = await createClient();
  let query = supabase
    .from("competition_results")
    .select(PRIZE_SHOWCASE_SELECT)
    .order("show_date", { ascending: false })
    .limit(limit);

  if (filters.year) {
    query = query
      .gte("show_date", `${filters.year}-01-01`)
      .lte("show_date", `${filters.year}-12-31`);
  }
  if (filters.speciesId) {
    query = query.eq("bird.species_id", filters.speciesId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as unknown as PrizeShowcaseEntry[];
}

/** Unieke show-/categorienamen uit eigen historie, voor autocomplete. */
export async function listDistinctShowNames() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("competition_results")
    .select("show_name")
    .order("show_date", { ascending: false });

  if (error) throw error;
  return Array.from(new Set(data.map((r) => r.show_name)));
}

export async function listDistinctCategories() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("competition_results")
    .select("category")
    .not("category", "is", null);

  if (error) throw error;
  return Array.from(new Set(data.map((r) => r.category).filter(Boolean))) as string[];
}
