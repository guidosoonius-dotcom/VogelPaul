# VogelPaul

Web app voor het beheer van een volière: vogels (kanaries, gouldamadines,
uitbreidbaar naar andere soorten), koppels, broedsels, stamboom en
wedstrijdresultaten. Gebouwd met Next.js (App Router) en Supabase
(Postgres, Auth, Storage).

## Supabase-project opzetten

Deze app heeft een eigen Supabase-project nodig (los per omgeving: bv. één
voor lokale ontwikkeling/staging, één voor productie).

1. Maak een project aan op [supabase.com](https://supabase.com/dashboard).
2. Voer de migraties in `supabase/migrations/` uit, in volgorde (0001 t/m
   0005), via de Supabase SQL-editor of de Supabase CLI:
   ```bash
   supabase link --project-ref <jouw-project-ref>
   supabase db push
   ```
3. Zet in **Authentication → Providers** e-mail/wachtwoord én magic link
   aan, en schakel **publieke registratie uit** (dit is een besloten app
   voor uitgenodigde kwekers — nieuwe gebruikers worden uitgenodigd via
   het Supabase dashboard onder Authentication → Users → Invite).
4. Kopieer de Project URL en de `anon`/`publishable` key uit
   **Project Settings → API**.
5. Kopieer `.env.local.example` naar `.env.local` en vul beide waarden in.

## Lokaal ontwikkelen

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Overige commando's:

```bash
npm run build   # productiebuild
npm run lint    # ESLint
npm run test    # unit tests (o.a. de kanarie-ringkleurcyclus)
```

## Typegeneratie

`lib/types/database.types.ts` is momenteel handgeschreven (er was nog geen
live Supabase-project beschikbaar tijdens de eerste opzet). Zodra het
project gekoppeld is, kan dit bestand vervangen worden door de
gegenereerde types, zodat het altijd in sync blijft met het schema:

```bash
supabase gen types typescript --project-id <jouw-project-ref> > lib/types/database.types.ts
```

## Deployen op Vercel

1. Importeer deze repository in Vercel.
2. Zet de omgevingsvariabelen `NEXT_PUBLIC_SUPABASE_URL` en
   `NEXT_PUBLIC_SUPABASE_ANON_KEY` (uit hetzelfde Supabase-project, of een
   apart productieproject) in de Vercel-projectinstellingen.
3. Deploy. Elke push naar de branch die aan het Vercel-project gekoppeld
   is, triggert een nieuwe build/preview.

## Projectstructuur

- `app/` — pagina's en routes (App Router), Nederlandstalige UI
- `components/` — UI-componenten per feature (vogels, koppels, broedsels,
  wedstrijden, stamboom) plus gedeelde primitieven in `components/ui/`
- `lib/domain/` — bedrijfslogica los van de database (o.a. de
  kanarie-ringkleurcyclus in `ringColor.ts`, met unit tests)
- `lib/queries/` — leesquery's richting Supabase
- `lib/storage/` — foto-upload/signed-URL-helpers voor Supabase Storage
- `lib/supabase/` — Supabase-clients (browser/server) en sessie-middleware
- `supabase/migrations/` — databaseschema, RLS-policies, stamboomfuncties
  en storage-buckets, in volgorde uit te voeren
