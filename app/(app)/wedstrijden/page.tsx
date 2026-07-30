import Link from "next/link";
import { listCompetitionResults } from "@/lib/queries/competitions";
import { formatBirdLabel } from "@/lib/domain/birdLabel";
import { Button } from "@/components/ui/Button";

export default async function WedstrijdenPage() {
  const results = await listCompetitionResults();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-zinc-900">Wedstrijden</h1>
        <Link href="/wedstrijden/nieuw">
          <Button>Nieuw resultaat</Button>
        </Link>
      </div>

      {results.length === 0 ? (
        <p className="mt-8 text-sm text-zinc-600">
          Nog geen wedstrijdresultaten geregistreerd.
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-md border border-zinc-200 bg-white">
          <table className="min-w-full divide-y divide-zinc-200 text-sm">
            <thead className="bg-zinc-50 text-left text-xs font-medium uppercase tracking-wide text-zinc-500">
              <tr>
                <th className="px-4 py-2">Wedstrijd</th>
                <th className="px-4 py-2">Datum</th>
                <th className="px-4 py-2">Vogel</th>
                <th className="px-4 py-2">Klassering</th>
                <th className="px-4 py-2">Punten</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {results.map((result) => (
                <tr key={result.id} className="hover:bg-zinc-50">
                  <td className="px-4 py-2">
                    <Link
                      href={`/wedstrijden/${result.id}`}
                      className="font-medium text-emerald-800 hover:underline"
                    >
                      {result.show_name}
                    </Link>
                  </td>
                  <td className="px-4 py-2 text-zinc-600">{result.show_date}</td>
                  <td className="px-4 py-2 text-zinc-600">
                    {result.bird ? formatBirdLabel(result.bird) : "-"}
                  </td>
                  <td className="px-4 py-2 text-zinc-600">{result.ranking ?? "-"}</td>
                  <td className="px-4 py-2 text-zinc-600">{result.points ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
