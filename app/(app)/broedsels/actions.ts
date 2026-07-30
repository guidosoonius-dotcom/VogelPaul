"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { BirdSex, BirdStatus } from "@/lib/types/database.types";

function optionalText(value: FormDataEntryValue | null): string | null {
  const text = (value ?? "").toString().trim();
  return text.length > 0 ? text : null;
}

function optionalInt(value: FormDataEntryValue | null): number | null {
  const text = optionalText(value);
  if (text === null) return null;
  const parsed = Number.parseInt(text, 10);
  return Number.isNaN(parsed) ? null : parsed;
}

async function getSpeciesIdForPair(
  supabase: Awaited<ReturnType<typeof createClient>>,
  pairId: string,
) {
  const { data: pair, error: pairError } = await supabase
    .from("pairs")
    .select("male_bird_id")
    .eq("id", pairId)
    .single();
  if (pairError) throw new Error(pairError.message);

  const { data: bird, error: birdError } = await supabase
    .from("birds")
    .select("species_id")
    .eq("id", pair.male_bird_id)
    .single();
  if (birdError) throw new Error(birdError.message);

  return bird.species_id;
}

export async function createBrood(pairId: string, formData: FormData) {
  const supabase = await createClient();
  const speciesId = await getSpeciesIdForPair(supabase, pairId);

  const payload = {
    pair_id: pairId,
    species_id: speciesId,
    clutch_started_at: optionalText(formData.get("clutch_started_at")),
    eggs_laid: optionalInt(formData.get("eggs_laid")) ?? 0,
    eggs_fertilized: optionalInt(formData.get("eggs_fertilized")),
    eggs_hatched: optionalInt(formData.get("eggs_hatched")) ?? 0,
    chicks_fledged: optionalInt(formData.get("chicks_fledged")) ?? 0,
    notes: optionalText(formData.get("notes")),
  };

  const { data, error } = await supabase
    .from("broods")
    .insert(payload)
    .select("id")
    .single();

  if (error) {
    throw new Error(`Broedsel opslaan is mislukt: ${error.message}`);
  }

  revalidatePath("/broedsels");
  revalidatePath(`/koppels/${pairId}`);
  redirect(`/broedsels/${data.id}`);
}

export async function updateBrood(broodId: string, formData: FormData) {
  const supabase = await createClient();

  const payload = {
    clutch_started_at: optionalText(formData.get("clutch_started_at")),
    eggs_laid: optionalInt(formData.get("eggs_laid")) ?? 0,
    eggs_fertilized: optionalInt(formData.get("eggs_fertilized")),
    eggs_hatched: optionalInt(formData.get("eggs_hatched")) ?? 0,
    chicks_fledged: optionalInt(formData.get("chicks_fledged")) ?? 0,
    notes: optionalText(formData.get("notes")),
  };

  const { error } = await supabase.from("broods").update(payload).eq("id", broodId);

  if (error) {
    throw new Error(`Broedsel bijwerken is mislukt: ${error.message}`);
  }

  revalidatePath("/broedsels");
  revalidatePath(`/broedsels/${broodId}`);
  redirect(`/broedsels/${broodId}`);
}

export async function deleteBrood(pairId: string, broodId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("broods").delete().eq("id", broodId);

  if (error) {
    throw new Error(`Broedsel verwijderen is mislukt: ${error.message}`);
  }

  revalidatePath("/broedsels");
  revalidatePath(`/koppels/${pairId}`);
  redirect(`/koppels/${pairId}`);
}

export async function registerOffspring(broodId: string, formData: FormData) {
  const supabase = await createClient();

  const { data: brood, error: broodError } = await supabase
    .from("broods")
    .select("species_id, pair_id")
    .eq("id", broodId)
    .single();
  if (broodError) throw new Error(broodError.message);

  const { data: pair, error: pairError } = await supabase
    .from("pairs")
    .select("male_bird_id, female_bird_id")
    .eq("id", brood.pair_id)
    .single();
  if (pairError) throw new Error(pairError.message);

  const payload = {
    species_id: brood.species_id,
    brood_id: broodId,
    father_id: pair.male_bird_id,
    mother_id: pair.female_bird_id,
    name: optionalText(formData.get("name")),
    sex: (formData.get("sex") as BirdSex) || "unknown",
    birth_date: optionalText(formData.get("birth_date")),
    ring_number: optionalText(formData.get("ring_number")),
    ring_year: optionalInt(formData.get("ring_year")),
    ring_color: optionalText(formData.get("ring_color")),
    ring_federation_code: optionalText(formData.get("ring_federation_code")),
    status: "active" as BirdStatus,
  };

  const { error } = await supabase.from("birds").insert(payload);

  if (error) {
    throw new Error(`Nakomeling toevoegen is mislukt: ${error.message}`);
  }

  revalidatePath(`/broedsels/${broodId}`);
  revalidatePath("/vogels");
}
