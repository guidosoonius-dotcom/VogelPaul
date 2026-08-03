# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # dev server (Turbopack), http://localhost:3000
npm run build    # production build (also type-checks)
npm run lint     # ESLint
npm run test     # vitest run (all unit tests)
npx vitest run lib/domain/ringColor.test.ts   # single test file
npx tsc --noEmit # type-check only, no build
```

There is no live Supabase project wired into CI — `.env.local` (gitignored) holds `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` for whichever project is currently linked. `npm run build` needs these set (even to placeholders) because `/login` is statically prerendered and constructs a Supabase client at build time.

## Architecture

VogelPaul is a Next.js (App Router) + Supabase (Postgres/Auth/Storage) app for bird breeders to track birds, breeding pairs, clutches, pedigree, and show results. All UI copy is Dutch; code identifiers are English.

**Multi-tenancy is enforced in Postgres, not just the UI.** Every owner-scoped table (`birds`, `pairs`, `broods`, `competition_results`, `profiles`) has `owner_id default auth.uid()` plus RLS policies restricting all four operations to `owner_id = auth.uid()`. Because a foreign key only checks existence, not ownership, `supabase/migrations/0002_rls_policies.sql` also adds `before insert/update` triggers (`check_bird_references_same_owner`, `check_pair_birds_same_owner`, etc.) that reject a row whose `father_id`/`mother_id`/`pair_id`/`bird_id` points at another owner's row. When adding a new owner-scoped table or a new cross-table reference, both the RLS policies and one of these ownership triggers need to be added — RLS alone is not sufficient.

**Species are data, not code branches.** One `birds` table serves every species; `species` is a shared (non-owner-scoped) reference table. Canary-specific behavior (the 6-year ring-color rotation: groen→paars→bruin→rood→blauw→zwart) is parameterized via `species.ring_color_cycle_enabled/length/start_year` rather than hardcoded, so a third species is just a new `species` row. The color rotation math lives in `lib/domain/ringColor.ts` as a pure function (tested in `ringColor.test.ts`) — it's used client-side to suggest a color while a form is being filled in, never to recompute a color that's already stored, since `birds.ring_color` is the source of truth (with `ring_color_overridden` flagging a manual correction).

**Pedigree is computed with recursive CTEs, not a closed table.** `birds.father_id`/`mother_id` self-reference `birds`. `get_ancestors`/`get_descendants` (in `0004_functions_pedigree.sql`) walk that tree via `with recursive`, are `security invoker` (so RLS still applies during the walk), and are called via `supabase.rpc(...)` from `lib/queries/pedigree.ts`. The pedigree UI (`components/pedigree/PedigreeTree.tsx`) renders the flat `{relation, generation}` rows as a nested fan-chart by building a `relation` lookup (`"father"`, `"father_mother"`, etc.) and recursing — missing ancestors render as an "Onbekend" placeholder rather than an error.

**Migrations are the schema's source of truth**, applied in numeric order from `supabase/migrations/` (0001 schema → 0002 RLS/ownership triggers → 0003 species seed → 0004 pedigree functions → 0005 storage buckets → 0006 security hardening). Apply them via the Supabase SQL editor or the Supabase MCP tools' `apply_migration`, always in order — later migrations assume earlier ones ran (e.g. 0002 enables RLS on tables 0001 created; 0001 itself has a circular-FK workaround where `birds.brood_id`'s foreign key constraint is added only after `broods` is created).

**`lib/types/database.types.ts` should be the Supabase-generated file**, not hand-written, once a project is linked (`supabase gen types typescript ...` or the MCP `generate_typescript_types` tool). It re-exports `BirdSex`/`BirdStatus`/`PairStatus` aliases at the bottom for the rest of the codebase to import — keep those aliases when regenerating. Several `lib/queries/*.ts` functions do embedded selects (e.g. `birds.select("*, species:species_id(...)")`) whose joined shape the generated types can't infer without real `Relationships` metadata already matching; those results are cast via `as unknown as XWithRelations[]` to a hand-declared interface in the same file rather than fought into the generic Supabase typing.

**Data access is layered**: `lib/supabase/{client,server,middleware}.ts` wrap `@supabase/ssr`'s browser/server clients; `lib/queries/*.ts` are read-only data-fetching functions used from Server Components; mutations are Server Actions colocated per feature in `app/(app)/<feature>/actions.ts` (not API routes). Photos (`bird-photos`, `competition-photos` Storage buckets) are private, uploaded via `lib/storage/photos.ts`, and only ever served through short-lived signed URLs — never public URLs.

**Route structure**: `app/(app)/` is a route group whose `layout.tsx` does the server-side auth check and redirects to `/login`; `proxy.ts` (not `middleware.ts` — see AGENTS.md, this Next.js version renamed the convention and requires the exported function to be named `proxy`) refreshes the Supabase session cookie on every request. Feature folders under `app/(app)/` (`vogels/`, `koppels/`, `broedsels/`, `wedstrijden/`) each follow list → `nieuw/` → `[id]/` → `[id]/bewerken/`, with an `actions.ts` alongside.
