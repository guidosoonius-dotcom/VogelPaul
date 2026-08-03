import Link from "next/link";
import { listBroods } from "@/lib/queries/broods";
import { formatBirdLabel } from "@/lib/domain/birdLabel";

export default async function BroedselsPage() {
  const broods = await listBroods();

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink">Broedsels</h1>
      <p className="mt-1 text-sm text-ink-soft">
        Een nieuw broedsel voeg je toe vanaf de koppel-pagina.
      </p>

      {broods.length === 0 ? (
        <p className="mt-8 text-sm text-ink-soft">Nog geen broedsels geregistreerd.</p>
      ) : (
        <div className="mt-6 overflow-x-auto overflow-y-hidden rounded-3xl border border-line-soft bg-card">
          <table className="min-w-full divide-y divide-line-soft text-sm">
            <thead className="bg-ground-deep text-left text-xs font-medium uppercase tracking-wide text-ink-faint">
              <tr>
                <th className="px-4 py-2">Koppel</th>
                <th className="px-4 py-2">Datum</th>
                <th className="px-4 py-2">Gelegd</th>
                <th className="px-4 py-2">Bevrucht</th>
                <th className="px-4 py-2">Uitgekomen</th>
                <th className="px-4 py-2">Uitgevlogen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line-soft">
              {broods.map((brood) => (
                <tr key={brood.id} className="transition-colors duration-150 hover:bg-ground-deep">
                  <td className="px-4 py-2">
                    <Link
                      href={`/broedsels/${brood.id}`}
                      className="font-medium text-moss-ink hover:underline"
                    >
                      {brood.pair?.male_bird ? formatBirdLabel(brood.pair.male_bird) : "?"} &times;{" "}
                      {brood.pair?.female_bird ? formatBirdLabel(brood.pair.female_bird) : "?"}
                    </Link>
                  </td>
                  <td className="px-4 py-2 text-ink-soft">
                    {brood.clutch_started_at ?? "-"}
                  </td>
                  <td className="px-4 py-2 text-ink-soft">{brood.eggs_laid}</td>
                  <td className="px-4 py-2 text-ink-soft">
                    {brood.eggs_fertilized ?? "-"}
                  </td>
                  <td className="px-4 py-2 text-ink-soft">{brood.eggs_hatched}</td>
                  <td className="px-4 py-2 text-ink-soft">{brood.chicks_fledged}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
