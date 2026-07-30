"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function optionalText(value: FormDataEntryValue | null): string | null {
  const text = (value ?? "").toString().trim();
  return text.length > 0 ? text : null;
}

export async function createPair(formData: FormData) {
  const supabase = await createClient();

  const payload = {
    male_bird_id: formData.get("male_bird_id") as string,
    female_bird_id: formData.get("female_bird_id") as string,
    started_at: optionalText(formData.get("started_at")) ?? new Date().toISOString().slice(0, 10),
    notes: optionalText(formData.get("notes")),
  };

  const { data, error } = await supabase
    .from("pairs")
    .insert(payload)
    .select("id")
    .single();

  if (error) {
    throw new Error(`Koppel opslaan is mislukt: ${error.message}`);
  }

  revalidatePath("/koppels");
  redirect(`/koppels/${data.id}`);
}

export async function endPair(pairId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("pairs")
    .update({ status: "ended", ended_at: new Date().toISOString().slice(0, 10) })
    .eq("id", pairId);

  if (error) {
    throw new Error(`Koppel beëindigen is mislukt: ${error.message}`);
  }

  revalidatePath("/koppels");
  revalidatePath(`/koppels/${pairId}`);
}

export async function deletePair(pairId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("pairs").delete().eq("id", pairId);

  if (error) {
    throw new Error(`Koppel verwijderen is mislukt: ${error.message}`);
  }

  revalidatePath("/koppels");
  redirect("/koppels");
}
