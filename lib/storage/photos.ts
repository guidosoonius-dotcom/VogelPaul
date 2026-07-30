import { createClient } from "@/lib/supabase/server";

const SIGNED_URL_EXPIRY_SECONDS = 60 * 60; // 1 uur

export async function uploadOwnerPhoto(
  bucket: "bird-photos" | "competition-photos",
  ownerId: string,
  recordId: string,
  file: File,
) {
  const supabase = await createClient();
  const extension = file.name.split(".").pop() || "jpg";
  const path = `${ownerId}/${recordId}/${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    throw new Error(`Foto uploaden is mislukt: ${error.message}`);
  }

  return path;
}

export async function getSignedPhotoUrl(
  bucket: "bird-photos" | "competition-photos",
  path: string | null,
) {
  if (!path) return null;

  const supabase = await createClient();
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, SIGNED_URL_EXPIRY_SECONDS);

  if (error) return null;
  return data.signedUrl;
}
