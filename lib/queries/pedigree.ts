import { createClient } from "@/lib/supabase/server";

export interface AncestorRow {
  id: string;
  ring_number: string | null;
  ring_year: number | null;
  ring_color: string | null;
  name: string | null;
  sex: "male" | "female" | "unknown";
  birth_date: string | null;
  species_id: string;
  generation: number;
  relation: string;
}

export async function getAncestors(birdId: string, maxDepth = 4) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_ancestors", {
    bird_id: birdId,
    max_depth: maxDepth,
  });

  if (error) throw error;
  return data as AncestorRow[];
}

/** Zet de platte lijst van get_ancestors om naar een lookup per relatiepad
 * (bv. "father", "father_mother"), zodat de stamboomweergave er direct in
 * kan opzoeken. */
export function ancestorsByRelation(rows: AncestorRow[]): Record<string, AncestorRow> {
  const map: Record<string, AncestorRow> = {};
  for (const row of rows) {
    map[row.relation] = row;
  }
  return map;
}
