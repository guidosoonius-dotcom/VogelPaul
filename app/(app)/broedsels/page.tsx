import Link from "next/link";
import { listBroods } from "@/lib/queries/broods";
import { formatBirdLabel } from "@/lib/domain/birdLabel";

export default async function BroedselsPage() {
  const broods = await listBroods();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-zinc-900">Broedsels</h1>
      <p className="mt-1 text-sm text-zinc-600">
        Een nieuw broedsel voeg je toe vanaf de koppel-pagina.
      </p>

      {broods.length === 0 ? (
        <p className="mt-8 text-sm text-zinc-600">Nog geen broedsels geregistreerd.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-md border border-zinc-200 bg-white">
          <table className="min-w-full divide-y divide-zinc-200 text-sm">
            <thead className="bg-zinc-50 text-left text-xs font-medium uppercase tracking-wide text-zinc-500">
              <tr>
                <th className="px-4 py-2">Koppel</th>
                <th className="px-4 py-2">Datum</th>
                <th className="px-4 py-2">Gelegd</th>
                <th className="px-4 py-2">Bevrucht</th>
                <th className="px-4 py-2">Uitgekomen</th>
                <th className="px-4 py-2">Uitgevlogen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {broods.map((brood) => (
                <tr key={brood.id} className="hover:bg-zinc-50">
                  <td className="px-4 py-2">
                    <Link
                      href={`/broedsels/${brood.id}`}
                      className="font-medium text-emerald-800 hover:underline"
                    >
                      {brood.pair?.male_bird ? formatBirdLabel(brood.pair.male_bird) : "?"} &times;{" "}
                      {brood.pair?.female_bird ? formatBirdLabel(brood.pair.female_bird) : "?"}
                    </Link>
                  </td>
                  <td className="px-4 py-2 text-zinc-600">
                    {brood.clutch_started_at ?? "-"}
                  </td>
                  <td className="px-4 py-2 text-zinc-600">{brood.eggs_laid}</td>
                  <td className="px-4 py-2 text-zinc-600">
                    {brood.eggs_fertilized ?? "-"}
                  </td>
                  <td className="px-4 py-2 text-zinc-600">{brood.eggs_hatched}</td>
                  <td className="px-4 py-2 text-zinc-600">{brood.chicks_fledged}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
