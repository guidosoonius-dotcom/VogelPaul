-- VogelPaul: stamboomfuncties
--
-- Recursieve CTE om voorouders (get_ancestors) en nakomelingen
-- (get_descendants) van een vogel op te halen, tot een opgegeven diepte.
-- `security invoker` zorgt dat RLS van de aanroepende gebruiker altijd
-- wordt gerespecteerd, ook tijdens de recursieve wandeling door de
-- boomstructuur.

create or replace function get_ancestors(bird_id uuid, max_depth int default 5)
returns table (
  id uuid,
  ring_number text,
  ring_year int,
  ring_color text,
  name text,
  sex bird_sex,
  birth_date date,
  species_id uuid,
  generation int,
  relation text
)
language sql
stable
security invoker
as $$
  with recursive ancestry as (
    select
      b.id, b.ring_number, b.ring_year, b.ring_color, b.name, b.sex,
      b.birth_date, b.species_id, b.father_id, b.mother_id,
      0 as generation,
      'self'::text as relation
    from birds b
    where b.id = get_ancestors.bird_id

    union all

    select
      p.id, p.ring_number, p.ring_year, p.ring_color, p.name, p.sex,
      p.birth_date, p.species_id, p.father_id, p.mother_id,
      a.generation + 1,
      a.relation || case when p.id = a.father_id then '_father' else '_mother' end
    from ancestry a
    join birds p on p.id = a.father_id or p.id = a.mother_id
    where a.generation < get_ancestors.max_depth
  )
  select id, ring_number, ring_year, ring_color, name, sex, birth_date, species_id, generation, relation
  from ancestry
  where relation <> 'self';
$$;

create or replace function get_descendants(bird_id uuid, max_depth int default 5)
returns table (
  id uuid,
  ring_number text,
  ring_year int,
  ring_color text,
  name text,
  sex bird_sex,
  birth_date date,
  species_id uuid,
  generation int
)
language sql
stable
security invoker
as $$
  with recursive descendants as (
    select
      b.id, b.ring_number, b.ring_year, b.ring_color, b.name, b.sex,
      b.birth_date, b.species_id,
      0 as generation
    from birds b
    where b.id = get_descendants.bird_id

    union all

    select
      c.id, c.ring_number, c.ring_year, c.ring_color, c.name, c.sex,
      c.birth_date, c.species_id,
      d.generation + 1
    from descendants d
    join birds c on c.father_id = d.id or c.mother_id = d.id
    where d.generation < get_descendants.max_depth
  )
  select id, ring_number, ring_year, ring_color, name, sex, birth_date, species_id, generation
  from descendants
  where generation > 0;
$$;
