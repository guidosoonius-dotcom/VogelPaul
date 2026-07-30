-- VogelPaul: private storage buckets voor foto's
--
-- Twee privé buckets (vogelfoto's en wedstrijd-/certificaatfoto's).
-- Bestandspad-conventie: {owner_id}/{record_id}/{bestandsnaam}. Toegang
-- verloopt via signed URLs die server-side gegenereerd worden; de RLS-
-- achtige storage policies hieronder zorgen dat een kweker alleen bij
-- bestanden onder zijn eigen owner_id-map kan.

insert into storage.buckets (id, name, public)
values
  ('bird-photos', 'bird-photos', false),
  ('competition-photos', 'competition-photos', false)
on conflict (id) do nothing;

create policy bird_photos_owner_select on storage.objects
  for select to authenticated
  using (
    bucket_id = 'bird-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy bird_photos_owner_insert on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'bird-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy bird_photos_owner_update on storage.objects
  for update to authenticated
  using (
    bucket_id = 'bird-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy bird_photos_owner_delete on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'bird-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy competition_photos_owner_select on storage.objects
  for select to authenticated
  using (
    bucket_id = 'competition-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy competition_photos_owner_insert on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'competition-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy competition_photos_owner_update on storage.objects
  for update to authenticated
  using (
    bucket_id = 'competition-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy competition_photos_owner_delete on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'competition-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
