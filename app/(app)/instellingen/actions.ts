"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Niet ingelogd");
  }

  const displayName = (formData.get("display_name") ?? "").toString().trim();
  const federationCode = (formData.get("federation_code") ?? "").toString().trim();

  const { error } = await supabase
    .from("profiles")
    .update({
      display_name: displayName || null,
      federation_code: federationCode || null,
    })
    .eq("id", user.id);

  if (error) {
    throw new Error(`Profiel bijwerken is mislukt: ${error.message}`);
  }

  revalidatePath("/instellingen");
}
