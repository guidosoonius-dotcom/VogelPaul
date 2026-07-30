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
      <h1 className="text-2xl font-semibold text-zinc-900">Dashboard</h1>

      <section className="mt-6">
        <h2 className="text-sm font-medium text-zinc-800">Overzicht</h2>
        <div className="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatTile label="Vogels totaal" value={stats.totalBirds} />
          <StatTile label="Actieve koppels" value={stats.activePairsCount} />
          <StatTile label="Broedsels dit seizoen" value={stats.broodsThisSeason} />
          <StatTile label="Uitkomstpercentage" value={formatPercent(stats.hatchRate)} />
        </div>
      </section>

      {stats.birdsBySpecies.length > 0 && (
        <section className="mt-6 rounded-md border border-zinc-200 bg-white p-4">
          <h2 className="text-sm font-medium text-zinc-800">Vogels per soort</h2>
          <ul className="mt-2 space-y-1 text-sm text-zinc-700">
            {stats.birdsBySpecies.map((entry) => (
              <li key={entry.speciesId} className="flex justify-between">
                <span>{entry.speciesName}</span>
                <span className="font-medium">{entry.count}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-6 rounded-md border border-zinc-200 bg-white p-4">
        <h2 className="text-sm font-medium text-zinc-800">Broedresultaten dit seizoen</h2>
        <div className="mt-2 grid grid-cols-3 gap-4">
          <StatTile label="Eieren gelegd" value={stats.eggsLaidThisSeason} />
          <StatTile label="Uitgekomen" value={stats.eggsHatchedThisSeason} />
          <StatTile label="Uitgevlogen" value={stats.chicksFledgedThisSeason} />
        </div>
        <p className="mt-2 text-xs text-zinc-500">
          Uitvliegpercentage (van uitgekomen naar uitgevlogen): {formatPercent(stats.fledgeRate)}
        </p>
      </section>

      <section className="mt-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-sm font-medium text-zinc-800">Prijswinnaars</h2>
          <Link href="/wedstrijden" className="text-sm text-emerald-800 hover:underline">
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
          <p className="mt-4 text-sm text-zinc-600">Nog geen prijswinnaars voor deze selectie.</p>
        ) : (
          <ul className="mt-4 divide-y divide-zinc-100 rounded-md border border-zinc-200 bg-white text-sm">
            {prizeShowcase.map((entry) => (
              <li key={entry.id} className="flex items-center justify-between px-4 py-3">
                <div>
                  <Link
                    href={`/wedstrijden/${entry.id}`}
                    className="font-medium text-emerald-800 hover:underline"
                  >
                    {entry.show_name}
                  </Link>
                  <p className="text-xs text-zinc-500">
                    {entry.bird ? formatBirdLabel(entry.bird) : "-"} &middot; {entry.show_date}
                  </p>
                </div>
                <span className="text-zinc-700">{entry.ranking ?? entry.points ?? "-"}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
