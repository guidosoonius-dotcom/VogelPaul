-- VogelPaul: seed van de eerste twee soortprofielen
--
-- De kanarie-ringkleurcyclus is een 6-jarige rotatie: groen, paars, bruin,
-- rood, blauw, zwart, en dan weer opnieuw. `ring_color_cycle_start_year`
-- is het ankerjaar waarin de cyclus op "groen" staat (2026, het huidige
-- jaar, volgens de aantekeningen van de gebruiker: "dit jaar groen").
-- Zie lib/domain/ringColor.ts voor de berekening die hierop leunt.

insert into species (code, name_nl, name_en, ring_color_cycle_enabled, ring_color_cycle_length, ring_color_cycle_start_year)
values
  ('canary', 'Kanarie', 'Canary', true, 6, 2026),
  ('gouldian_finch', 'Gouldamadine', 'Gouldian Finch', false, 6, null)
on conflict (code) do nothing;
