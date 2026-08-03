import Link from "next/link";
import { listBirds } from "@/lib/queries/birds";
import { getSpeciesList } from "@/lib/queries/species";
import { formatBirdLabel, formatSex, formatStatus } from "@/lib/domain/birdLabel";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Field";
import RingColorChip from "@/components/ui/RingColorChip";
import type { BirdSex, BirdStatus } from "@/lib/types/database.types";

export default async function VogelsPage({
  searchParams,
}: {
  searchParams: Promise<{ species?: string; sex?: string; status?: string }>;
}) {
  const params = await searchParams;
  const species = await getSpeciesList();
  const birds = await listBirds({
    speciesId: params.species || undefined,
    sex: (params.sex as BirdSex) || undefined,
    status: (params.status as BirdStatus) || undefined,
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-ink">Vogels</h1>
        <Link href="/vogels/nieuw">
          <Button>Nieuwe vogel</Button>
        </Link>
      </div>

      <form className="mt-4 flex flex-wrap gap-3" method="get">
        <Select name="species" defaultValue={params.species ?? ""} className="w-auto">
          <option value="">Alle soorten</option>
          {species.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name_nl}
            </option>
          ))}
        </Select>
        <Select name="sex" defaultValue={params.sex ?? ""} className="w-auto">
          <option value="">Alle geslachten</option>
          <option value="male">Man</option>
          <option value="female">Pop</option>
          <option value="unknown">Onbekend</option>
        </Select>
        <Select name="status" defaultValue={params.status ?? ""} className="w-auto">
          <option value="">Alle statussen</option>
          <option value="active">Actief</option>
          <option value="deceased">Overleden</option>
          <option value="sold">Verkocht</option>
          <option value="given_away">Weggegeven</option>
        </Select>
        <Button type="submit" variant="secondary">
          Filteren
        </Button>
      </form>

      {birds.length === 0 ? (
        <p className="mt-8 text-sm text-ink-soft">
          Nog geen vogels toegevoegd. Klik op &quot;Nieuwe vogel&quot; om te beginnen.
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto overflow-y-hidden rounded-3xl border border-line-soft bg-card">
          <table className="min-w-full divide-y divide-line-soft text-sm">
            <thead className="bg-ground-deep text-left text-xs font-medium uppercase tracking-wide text-ink-faint">
              <tr>
                <th className="px-4 py-2">Vogel</th>
                <th className="px-4 py-2">Soort</th>
                <th className="px-4 py-2">Geslacht</th>
                <th className="px-4 py-2">Ring</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line-soft">
              {birds.map((bird) => (
                <tr key={bird.id} className="transition-colors duration-150 hover:bg-ground-deep">
                  <td className="px-4 py-2">
                    <Link
                      href={`/vogels/${bird.id}`}
                      className="font-medium text-moss-ink hover:underline"
                    >
                      {formatBirdLabel(bird)}
                    </Link>
                  </td>
                  <td className="px-4 py-2 text-ink-soft">
                    {bird.species?.name_nl ?? "-"}
                  </td>
                  <td className="px-4 py-2 text-ink-soft">{formatSex(bird.sex)}</td>
                  <td className="px-4 py-2 text-ink-soft">
                    {bird.ring_number ?? "-"}
                    {bird.ring_color && (
                      <>
                        {" "}
                        (<RingColorChip color={bird.ring_color} />)
                      </>
                    )}
                  </td>
                  <td className="px-4 py-2 text-ink-soft">{formatStatus(bird.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
