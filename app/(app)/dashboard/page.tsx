import Image from "next/image";
import Link from "next/link";
import { getDashboardStats } from "@/lib/queries/dashboard";
import { getPrizeShowcase } from "@/lib/queries/competitions";
import { getSpeciesList } from "@/lib/queries/species";
import { formatBirdLabel } from "@/lib/domain/birdLabel";
import StatTile from "@/components/ui/StatTile";
import { Select, FieldWrapper } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

function formatPercent(value: number | null): string {
  if (value === null) return "-";
  return `${Math.round(value * 100)}%`;
}

const BAR_COLORS = ["bg-moss", "bg-brass", "bg-ring-blauw", "bg-ring-bruin"];

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string; species?: string }>;
}) {
  const params = await searchParams;
  const year = params.year ? Number.parseInt(params.year, 10) : undefined;

  const [stats, species, prizeShowcase] = await Promise.all([
    getDashboardStats(),
    getSpeciesList(),
    getPrizeShowcase({
      year: year && !Number.isNaN(year) ? year : undefined,
      speciesId: params.species || undefined,
    }),
  ]);

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - i);

  return (
    <div>
      <section className="relative h-48 overflow-hidden rounded-3xl sm:h-56">
        <Image
          src="/hero-bird.jpg"
          alt="Gele zangvogel op een bloesemtak"
          fill
          priority
          sizes="(min-width: 1024px) 1024px, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-ink/0" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8">
          <h1 className="font-display text-3xl font-black leading-[1.05] text-card-raised sm:text-4xl">
            Welkom terug.
          </h1>
          <p className="mt-2 text-sm text-card-raised/85 sm:text-base">
            Seizoen {currentYear} &middot; overzicht van je volière
          </p>
        </div>
      </section>

      <section className="mt-6">
        <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-ink-faint">Overzicht</h2>
        <div className="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatTile label="Vogels totaal" value={stats.totalBirds} />
          <StatTile label="Actieve koppels" value={stats.activePairsCount} />
          <StatTile label="Broedsels dit seizoen" value={stats.broodsThisSeason} accent="brass" />
          <StatTile label="Uitkomstpercentage" value={formatPercent(stats.hatchRate)} />
        </div>
      </section>

      {stats.birdsBySpecies.length > 0 && (
        <section className="mt-6 rounded-3xl border border-line-soft bg-card p-4">
          <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-ink-faint">Vogels per soort</h2>
          <div className="mt-3 space-y-3">
            {stats.birdsBySpecies.map((entry, i) => (
              <div key={entry.speciesId} className="flex items-center gap-3">
                <div className="w-28 shrink-0 text-sm font-bold text-ink">{entry.speciesName}</div>
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-ground-deep">
                  <div
                    className={`h-full rounded-full ${BAR_COLORS[i % BAR_COLORS.length]}`}
                    style={{ width: `${(entry.count / stats.totalBirds) * 100}%` }}
                  />
                </div>
                <div className="w-7 shrink-0 text-right font-mono text-sm tabular-nums text-ink-soft">
                  {entry.count}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mt-6 rounded-3xl border border-line-soft bg-card p-4">
        <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-ink-faint">Broedresultaten dit seizoen</h2>
        <div className="mt-3 grid grid-cols-3 gap-4">
          <StatTile label="Eieren gelegd" value={stats.eggsLaidThisSeason} flat />
          <StatTile label="Uitgekomen" value={stats.eggsHatchedThisSeason} flat />
          <StatTile label="Uitgevlogen" value={stats.chicksFledgedThisSeason} flat />
        </div>
        <p className="mt-3 text-xs text-ink-faint">
          Uitvliegpercentage (van uitgekomen naar uitgevlogen): {formatPercent(stats.fledgeRate)}
        </p>
      </section>

      <section className="mt-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-ink-faint">Prijswinnaars</h2>
          <Link href="/wedstrijden" className="text-sm text-moss-ink hover:underline">
            Alle wedstrijden
          </Link>
        </div>

        <form className="mt-3 flex flex-wrap gap-3" method="get">
          <FieldWrapper label="Jaar" htmlFor="year-filter">
            <Select id="year-filter" name="year" defaultValue={params.year ?? ""} className="w-auto">
              <option value="">Alle jaren</option>
              {yearOptions.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </Select>
          </FieldWrapper>
          <FieldWrapper label="Soort" htmlFor="species-filter">
            <Select
              id="species-filter"
              name="species"
              defaultValue={params.species ?? ""}
              className="w-auto"
            >
              <option value="">Alle soorten</option>
              {species.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name_nl}
                </option>
              ))}
            </Select>
          </FieldWrapper>
          <div className="self-end">
            <Button type="submit" variant="secondary">
              Filteren
            </Button>
          </div>
        </form>

        {prizeShowcase.length === 0 ? (
          <p className="mt-4 text-sm text-ink-soft">Nog geen prijswinnaars voor deze selectie.</p>
        ) : (
          <ul className="mt-4 divide-y divide-line-soft rounded-3xl border border-line-soft bg-card px-2 text-sm">
            {prizeShowcase.map((entry) => (
              <li key={entry.id}>
                <Link
                  href={`/wedstrijden/${entry.id}`}
                  className="flex items-center gap-3.5 rounded-xl px-2 py-3 transition-[background-color,transform] duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] hover:translate-x-0.5 hover:bg-ground-deep"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-brass/25 bg-brass-tint font-mono text-xs font-bold text-brass">
                    {(entry.ranking ?? "?").slice(0, 2)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-bold text-ink">{entry.show_name}</span>
                    <span className="block truncate text-xs text-ink-faint">
                      {entry.bird ? formatBirdLabel(entry.bird) : "-"} &middot; {entry.show_date}
                    </span>
                  </span>
                  <span className="shrink-0 font-mono text-sm font-bold text-moss-ink">
                    {entry.points ? `${entry.points} pt` : entry.ranking ?? "-"}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
