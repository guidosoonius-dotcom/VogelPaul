"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { uploadOwnerPhoto } from "@/lib/storage/photos";

function optionalText(value: FormDataEntryValue | null): string | null {
  const text = (value ?? "").toString().trim();
  return text.length > 0 ? text : null;
}

function optionalNumber(value: FormDataEntryValue | null): number | null {
  const text = optionalText(value);
  if (text === null) return null;
  const parsed = Number.parseFloat(text);
  return Number.isNaN(parsed) ? null : parsed;
}

function basePayload(formData: FormData) {
  return {
    bird_id: formData.get("bird_id") as string,
    show_name: (formData.get("show_name") as string).trim(),
    show_date: formData.get("show_date") as string,
    location: optionalText(formData.get("location")),
    category: optionalText(formData.get("category")),
    points: optionalNumber(formData.get("points")),
    ranking: optionalText(formData.get("ranking")),
    notes: optionalText(formData.get("notes")),
  };
}

export async function createCompetitionResult(formData: FormData) {
  const supabase = await createClient();
  const payload = basePayload(formData);

  const { data, error } = await supabase
    .from("competition_results")
    .insert(payload)
    .select("id, owner_id")
    .single();

  if (error) {
    throw new Error(`Wedstrijdresultaat opslaan is mislukt: ${error.message}`);
  }

  const photo = formData.get("photo");
  if (photo instanceof File && photo.size > 0) {
    const path = await uploadOwnerPhoto(
      "competition-photos",
      data.owner_id,
      data.id,
      photo,
    );
    await supabase
      .from("competition_results")
      .update({ photo_url: path })
      .eq("id", data.id);
  }

  revalidatePath("/wedstrijden");
  revalidatePath(`/vogels/${payload.bird_id}`);
  redirect(`/wedstrijden/${data.id}`);
}

export async function updateCompetitionResult(resultId: string, formData: FormData) {
  const supabase = await createClient();
  const payload = basePayload(formData);

  const { data: existing, error: fetchError } = await supabase
    .from("competition_results")
    .select("owner_id, bird_id")
    .eq("id", resultId)
    .single();
  if (fetchError) throw new Error(fetchError.message);

  const { error } = await supabase
    .from("competition_results")
    .update(payload)
    .eq("id", resultId);

  if (error) {
    throw new Error(`Wedstrijdresultaat bijwerken is mislukt: ${error.message}`);
  }

  const photo = formData.get("photo");
  if (photo instanceof File && photo.size > 0) {
    const path = await uploadOwnerPhoto(
      "competition-photos",
      existing.owner_id,
      resultId,
      photo,
    );
    await supabase
      .from("competition_results")
      .update({ photo_url: path })
      .eq("id", resultId);
  }

  revalidatePath("/wedstrijden");
  revalidatePath(`/wedstrijden/${resultId}`);
  revalidatePath(`/vogels/${payload.bird_id}`);
  redirect(`/wedstrijden/${resultId}`);
}

export async function deleteCompetitionResult(birdId: string, resultId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("competition_results")
    .delete()
    .eq("id", resultId);

  if (error) {
    throw new Error(`Wedstrijdresultaat verwijderen is mislukt: ${error.message}`);
  }

  revalidatePath("/wedstrijden");
  revalidatePath(`/vogels/${birdId}`);
  redirect("/wedstrijden");
}
