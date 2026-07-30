import Link from "next/link";
import { listPairs } from "@/lib/queries/pairs";
import { formatBirdLabel } from "@/lib/domain/birdLabel";
import { Button } from "@/components/ui/Button";

export default async function KoppelsPage() {
  const pairs = await listPairs();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-zinc-900">Koppels</h1>
        <Link href="/koppels/nieuw">
          <Button>Nieuw koppel</Button>
        </Link>
      </div>

      {pairs.length === 0 ? (
        <p className="mt-8 text-sm text-zinc-600">
          Nog geen koppels toegevoegd. Klik op &quot;Nieuw koppel&quot; om te beginnen.
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-md border border-zinc-200 bg-white">
          <table className="min-w-full divide-y divide-zinc-200 text-sm">
            <thead className="bg-zinc-50 text-left text-xs font-medium uppercase tracking-wide text-zinc-500">
              <tr>
                <th className="px-4 py-2">Man</th>
                <th className="px-4 py-2">Pop</th>
                <th className="px-4 py-2">Gestart</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {pairs.map((pair) => (
                <tr key={pair.id} className="hover:bg-zinc-50">
                  <td className="px-4 py-2">
                    <Link
                      href={`/koppels/${pair.id}`}
                      className="font-medium text-emerald-800 hover:underline"
                    >
                      {pair.male_bird ? formatBirdLabel(pair.male_bird) : "-"}
                    </Link>
                  </td>
                  <td className="px-4 py-2 text-zinc-700">
                    {pair.female_bird ? formatBirdLabel(pair.female_bird) : "-"}
                  </td>
                  <td className="px-4 py-2 text-zinc-600">{pair.started_at}</td>
                  <td className="px-4 py-2 text-zinc-600">
                    {pair.status === "active" ? "Actief" : "Beëindigd"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
