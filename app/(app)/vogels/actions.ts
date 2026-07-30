"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { uploadOwnerPhoto } from "@/lib/storage/photos";
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

function birdPayloadFromFormData(formData: FormData) {
  return {
    species_id: formData.get("species_id") as string,
    name: optionalText(formData.get("name")),
    sex: formData.get("sex") as BirdSex,
    birth_date: optionalText(formData.get("birth_date")),
    ring_number: optionalText(formData.get("ring_number")),
    ring_year: optionalInt(formData.get("ring_year")),
    ring_color: optionalText(formData.get("ring_color")),
    ring_federation_code: optionalText(formData.get("ring_federation_code")),
    ring_color_overridden: formData.get("ring_color_overridden") === "on",
    father_id: optionalText(formData.get("father_id")),
    mother_id: optionalText(formData.get("mother_id")),
    status: formData.get("status") as BirdStatus,
    notes: optionalText(formData.get("notes")),
  };
}

export async function createBird(formData: FormData) {
  const supabase = await createClient();
  const payload = birdPayloadFromFormData(formData);

  const { data, error } = await supabase
    .from("birds")
    .insert(payload)
    .select("id, owner_id")
    .single();

  if (error) {
    throw new Error(`Vogel opslaan is mislukt: ${error.message}`);
  }

  const photo = formData.get("photo");
  if (photo instanceof File && photo.size > 0) {
    const path = await uploadOwnerPhoto("bird-photos", data.owner_id, data.id, photo);
    await supabase.from("birds").update({ photo_url: path }).eq("id", data.id);
  }

  revalidatePath("/vogels");
  redirect(`/vogels/${data.id}`);
}

export async function updateBird(birdId: string, formData: FormData) {
  const supabase = await createClient();
  const payload = birdPayloadFromFormData(formData);

  const { data: existing, error: fetchError } = await supabase
    .from("birds")
    .select("owner_id")
    .eq("id", birdId)
    .single();
  if (fetchError) throw new Error(fetchError.message);

  const { error } = await supabase
    .from("birds")
    .update(payload)
    .eq("id", birdId);

  if (error) {
    throw new Error(`Vogel bijwerken is mislukt: ${error.message}`);
  }

  const photo = formData.get("photo");
  if (photo instanceof File && photo.size > 0) {
    const path = await uploadOwnerPhoto("bird-photos", existing.owner_id, birdId, photo);
    await supabase.from("birds").update({ photo_url: path }).eq("id", birdId);
  }

  revalidatePath("/vogels");
  revalidatePath(`/vogels/${birdId}`);
  redirect(`/vogels/${birdId}`);
}

export async function deleteBird(birdId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("birds").delete().eq("id", birdId);

  if (error) {
    throw new Error(`Vogel verwijderen is mislukt: ${error.message}`);
  }

  revalidatePath("/vogels");
  redirect("/vogels");
}
