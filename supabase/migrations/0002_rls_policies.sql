-- VogelPaul: Row-Level Security en cross-owner integriteitscontroles
--
-- Elke kweker (auth.users rij) mag uitsluitend zijn eigen vogels, koppels,
-- broedsels en wedstrijdresultaten zien en wijzigen. RLS regelt de
-- toegang; de triggers hieronder voorkomen daarnaast dat een rij kan
-- verwijzen naar een rij van een andere eigenaar (bv. father_id die naar
-- de vogel van een andere kweker wijst) — een foreign key controleert
-- namelijk alleen of de rij bestaat, niet van wie hij is.

-- ---------------------------------------------------------------------------
-- species: gedeelde referentiedata, alleen leesbaar
-- ---------------------------------------------------------------------------
alter table species enable row level security;

create policy species_select_authenticated on species
  for select
  to authenticated
  using (true);

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
alter table profiles enable row level security;

create policy profiles_select_own on profiles
  for select using (id = auth.uid());
create policy profiles_update_own on profiles
  for update using (id = auth.uid()) with check (id = auth.uid());

-- ---------------------------------------------------------------------------
-- birds
-- ---------------------------------------------------------------------------
alter table birds enable row level security;

create policy birds_select_own on birds
  for select using (owner_id = auth.uid());
create policy birds_insert_own on birds
  for insert with check (owner_id = auth.uid());
create policy birds_update_own on birds
  for update using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy birds_delete_own on birds
  for delete using (owner_id = auth.uid());

-- ---------------------------------------------------------------------------
-- pairs
-- ---------------------------------------------------------------------------
alter table pairs enable row level security;

create policy pairs_select_own on pairs
  for select using (owner_id = auth.uid());
create policy pairs_insert_own on pairs
  for insert with check (owner_id = auth.uid());
create policy pairs_update_own on pairs
  for update using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy pairs_delete_own on pairs
  for delete using (owner_id = auth.uid());

-- ---------------------------------------------------------------------------
-- broods
-- ---------------------------------------------------------------------------
alter table broods enable row level security;

create policy broods_select_own on broods
  for select using (owner_id = auth.uid());
create policy broods_insert_own on broods
  for insert with check (owner_id = auth.uid());
create policy broods_update_own on broods
  for update using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy broods_delete_own on broods
  for delete using (owner_id = auth.uid());

-- ---------------------------------------------------------------------------
-- competition_results
-- ---------------------------------------------------------------------------
alter table competition_results enable row level security;

create policy competition_results_select_own on competition_results
  for select using (owner_id = auth.uid());
create policy competition_results_insert_own on competition_results
  for insert with check (owner_id = auth.uid());
create policy competition_results_update_own on competition_results
  for update using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy competition_results_delete_own on competition_results
  for delete using (owner_id = auth.uid());

-- ---------------------------------------------------------------------------
-- Cross-owner integriteitstriggers
-- ---------------------------------------------------------------------------

create or replace function check_bird_references_same_owner()
returns trigger
language plpgsql
as $$
declare
  parent_owner uuid;
begin
  if new.father_id is not null then
    select owner_id into parent_owner from birds where id = new.father_id;
    if parent_owner is null or parent_owner <> new.owner_id then
      raise exception 'father_id verwijst naar een vogel van een andere eigenaar';
    end if;
  end if;

  if new.mother_id is not null then
    select owner_id into parent_owner from birds where id = new.mother_id;
    if parent_owner is null or parent_owner <> new.owner_id then
      raise exception 'mother_id verwijst naar een vogel van een andere eigenaar';
    end if;
  end if;

  if new.brood_id is not null then
    select owner_id into parent_owner from broods where id = new.brood_id;
    if parent_owner is null or parent_owner <> new.owner_id then
      raise exception 'brood_id verwijst naar een broedsel van een andere eigenaar';
    end if;
  end if;

  return new;
end;
$$;

create trigger birds_check_same_owner
  before insert or update on birds
  for each row execute function check_bird_references_same_owner();

create or replace function check_pair_birds_same_owner()
returns trigger
language plpgsql
as $$
declare
  bird_owner uuid;
begin
  select owner_id into bird_owner from birds where id = new.male_bird_id;
  if bird_owner is null or bird_owner <> new.owner_id then
    raise exception 'male_bird_id verwijst naar een vogel van een andere eigenaar';
  end if;

  select owner_id into bird_owner from birds where id = new.female_bird_id;
  if bird_owner is null or bird_owner <> new.owner_id then
    raise exception 'female_bird_id verwijst naar een vogel van een andere eigenaar';
  end if;

  return new;
end;
$$;

create trigger pairs_check_same_owner
  before insert or update on pairs
  for each row execute function check_pair_birds_same_owner();

create or replace function check_brood_pair_same_owner()
returns trigger
language plpgsql
as $$
declare
  pair_owner uuid;
begin
  select owner_id into pair_owner from pairs where id = new.pair_id;
  if pair_owner is null or pair_owner <> new.owner_id then
    raise exception 'pair_id verwijst naar een koppel van een andere eigenaar';
  end if;

  return new;
end;
$$;

create trigger broods_check_same_owner
  before insert or update on broods
  for each row execute function check_brood_pair_same_owner();

create or replace function check_competition_bird_same_owner()
returns trigger
language plpgsql
as $$
declare
  bird_owner uuid;
begin
  select owner_id into bird_owner from birds where id = new.bird_id;
  if bird_owner is null or bird_owner <> new.owner_id then
    raise exception 'bird_id verwijst naar een vogel van een andere eigenaar';
  end if;

  return new;
end;
$$;

create trigger competition_results_check_same_owner
  before insert or update on competition_results
  for each row execute function check_competition_bird_same_owner();
