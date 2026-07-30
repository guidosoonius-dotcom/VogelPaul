import { createClient } from "@/lib/supabase/server";

export interface SpeciesBreakdown {
  speciesId: string;
  speciesName: string;
  count: number;
}

export interface DashboardStats {
  totalBirds: number;
  birdsBySpecies: SpeciesBreakdown[];
  activePairsCount: number;
  broodsThisSeason: number;
  eggsLaidThisSeason: number;
  eggsHatchedThisSeason: number;
  chicksFledgedThisSeason: number;
  hatchRate: number | null;
  fledgeRate: number | null;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createClient();
  const currentYear = new Date().getFullYear();

  const [{ data: birds, error: birdsError }, { data: species, error: speciesError }, { data: pairs, error: pairsError }, { data: broods, error: broodsError }] =
    await Promise.all([
      supabase.from("birds").select("id, species_id"),
      supabase.from("species").select("id, name_nl"),
      supabase.from("pairs").select("id, status"),
      supabase
        .from("broods")
        .select("id, clutch_started_at, created_at, eggs_laid, eggs_hatched, chicks_fledged"),
    ]);

  if (birdsError) throw birdsError;
  if (speciesError) throw speciesError;
  if (pairsError) throw pairsError;
  if (broodsError) throw broodsError;

  const speciesNameById = new Map(species.map((s) => [s.id, s.name_nl]));
  const countBySpeciesId = new Map<string, number>();
  for (const bird of birds) {
    countBySpeciesId.set(bird.species_id, (countBySpeciesId.get(bird.species_id) ?? 0) + 1);
  }
  const birdsBySpecies: SpeciesBreakdown[] = Array.from(countBySpeciesId.entries())
    .map(([speciesId, count]) => ({
      speciesId,
      speciesName: speciesNameById.get(speciesId) ?? "Onbekend",
      count,
    }))
    .sort((a, b) => b.count - a.count);

  const activePairsCount = pairs.filter((p) => p.status === "active").length;

  const broodsThisSeason = broods.filter((b) => {
    const referenceDate = b.clutch_started_at ?? b.created_at;
    return new Date(referenceDate).getFullYear() === currentYear;
  });

  const eggsLaidThisSeason = broodsThisSeason.reduce((sum, b) => sum + b.eggs_laid, 0);
  const eggsHatchedThisSeason = broodsThisSeason.reduce((sum, b) => sum + b.eggs_hatched, 0);
  const chicksFledgedThisSeason = broodsThisSeason.reduce(
    (sum, b) => sum + b.chicks_fledged,
    0,
  );

  return {
    totalBirds: birds.length,
    birdsBySpecies,
    activePairsCount,
    broodsThisSeason: broodsThisSeason.length,
    eggsLaidThisSeason,
    eggsHatchedThisSeason,
    chicksFledgedThisSeason,
    hatchRate: eggsLaidThisSeason > 0 ? eggsHatchedThisSeason / eggsLaidThisSeason : null,
    fledgeRate: eggsHatchedThisSeason > 0 ? chicksFledgedThisSeason / eggsHatchedThisSeason : null,
  };
}
