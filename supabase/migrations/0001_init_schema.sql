-- VogelPaul: kernschema
-- Generiek datamodel voor het bijhouden van vogels, koppels, broedsels en
-- wedstrijdresultaten. Soort-specifiek gedrag (zoals de kanarie-
-- ringkleurcyclus) wordt geparametriseerd via de `species`-tabel in plaats
-- van aparte tabellen per soort.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- species: gedeelde referentietabel (geen owner-scoping)
-- ---------------------------------------------------------------------------
create table species (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name_nl text not null,
  name_en text,
  ring_color_cycle_enabled boolean not null default false,
  ring_color_cycle_length int not null default 6,
  ring_color_cycle_start_year int,
  default_incubation_days int,
  default_fledge_days int,
  created_at timestamptz not null default now()
);

comment on table species is 'Gedeelde referentietabel met soortprofielen (bv. kanarie, gouldamadine). Niet owner-gescoped.';

-- ---------------------------------------------------------------------------
-- profiles: 1:1 met auth.users
-- ---------------------------------------------------------------------------
create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  federation_code text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- birds (vogels)
-- ---------------------------------------------------------------------------
create type bird_sex as enum ('male', 'female', 'unknown');
create type bird_status as enum ('active', 'deceased', 'sold', 'given_away');

create table birds (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  species_id uuid not null references species (id),
  name text,
  sex bird_sex not null default 'unknown',
  birth_date date,

  -- ringgegevens (rechtstreeks als kolommen, zie plan: v1-eenvoud)
  ring_number text,
  ring_year int,
  ring_color text,
  ring_federation_code text,
  ring_color_overridden boolean not null default false,

  father_id uuid references birds (id) on delete set null,
  mother_id uuid references birds (id) on delete set null,
  -- brood_id verwijst naar broods, die pas later in deze migratie wordt
  -- aangemaakt (circulaire relatie birds <-> broods <-> pairs). De FK-
  -- constraint wordt hieronder na het aanmaken van `broods` toegevoegd.
  brood_id uuid,

  status bird_status not null default 'active',
  photo_url text,
  notes text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint birds_not_own_father check (father_id is null or father_id <> id),
  constraint birds_not_own_mother check (mother_id is null or mother_id <> id),
  constraint birds_parents_differ check (father_id is null or mother_id is null or father_id <> mother_id)
);

create index birds_owner_id_idx on birds (owner_id);
create index birds_species_id_idx on birds (species_id);
create index birds_father_id_idx on birds (father_id);
create index birds_mother_id_idx on birds (mother_id);
create index birds_brood_id_idx on birds (brood_id);

-- ---------------------------------------------------------------------------
-- pairs (koppels)
-- ---------------------------------------------------------------------------
create type pair_status as enum ('active', 'ended');

create table pairs (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  male_bird_id uuid not null references birds (id) on delete cascade,
  female_bird_id uuid not null references birds (id) on delete cascade,
  started_at date not null default current_date,
  ended_at date,
  status pair_status not null default 'active',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint pairs_distinct_birds check (male_bird_id <> female_bird_id)
);

create index pairs_owner_id_idx on pairs (owner_id);
create index pairs_male_bird_id_idx on pairs (male_bird_id);
create index pairs_female_bird_id_idx on pairs (female_bird_id);

-- ---------------------------------------------------------------------------
-- broods (broedsels)
-- ---------------------------------------------------------------------------
create table broods (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  pair_id uuid not null references pairs (id) on delete cascade,
  species_id uuid not null references species (id),

  clutch_started_at date,
  eggs_laid int not null default 0,
  eggs_fertilized int,
  eggs_hatched int not null default 0,
  chicks_fledged int not null default 0,
  notes text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint broods_eggs_laid_nonneg check (eggs_laid >= 0),
  constraint broods_fertilized_le_laid check (eggs_fertilized is null or eggs_fertilized <= eggs_laid),
  constraint broods_hatched_le_laid check (eggs_hatched <= eggs_laid),
  constraint broods_fledged_le_hatched check (chicks_fledged <= eggs_hatched)
);

create index broods_owner_id_idx on broods (owner_id);
create index broods_pair_id_idx on broods (pair_id);

-- nu broods bestaat: FK voor birds.brood_id toevoegen
alter table birds
  add constraint birds_brood_id_fkey foreign key (brood_id) references broods (id) on delete set null;

-- ---------------------------------------------------------------------------
-- competition_results (wedstrijden/prijzen)
-- ---------------------------------------------------------------------------
create table competition_results (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  bird_id uuid not null references birds (id) on delete cascade,

  show_name text not null,
  show_date date not null,
  location text,
  category text,
  points numeric,
  ranking text,
  photo_url text,
  notes text,

  created_at timestamptz not null default now()
);

create index competition_results_owner_id_idx on competition_results (owner_id);
create index competition_results_bird_id_idx on competition_results (bird_id);

-- ---------------------------------------------------------------------------
-- updated_at trigger helper
-- ---------------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger birds_set_updated_at before update on birds
  for each row execute function set_updated_at();
create trigger pairs_set_updated_at before update on pairs
  for each row execute function set_updated_at();
create trigger broods_set_updated_at before update on broods
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- profiles automatisch aanmaken bij nieuwe gebruiker
-- ---------------------------------------------------------------------------
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, new.raw_user_meta_data ->> 'display_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
