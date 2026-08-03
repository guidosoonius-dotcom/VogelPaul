import Link from "next/link";
import { listCompetitionResults } from "@/lib/queries/competitions";
import { formatBirdLabel } from "@/lib/domain/birdLabel";
import { Button } from "@/components/ui/Button";

export default async function WedstrijdenPage() {
  const results = await listCompetitionResults();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-ink">Wedstrijden</h1>
        <Link href="/wedstrijden/nieuw">
          <Button>Nieuw resultaat</Button>
        </Link>
      </div>

      {results.length === 0 ? (
        <p className="mt-8 text-sm text-ink-soft">
          Nog geen wedstrijdresultaten geregistreerd.
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-lg border border-line-soft bg-card">
          <table className="min-w-full divide-y divide-line-soft text-sm">
            <thead className="bg-ground-deep text-left text-xs font-medium uppercase tracking-wide text-ink-faint">
              <tr>
                <th className="px-4 py-2">Wedstrijd</th>
                <th className="px-4 py-2">Datum</th>
                <th className="px-4 py-2">Vogel</th>
                <th className="px-4 py-2">Klassering</th>
                <th className="px-4 py-2">Punten</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line-soft">
              {results.map((result) => (
                <tr key={result.id} className="transition-colors duration-150 hover:bg-ground-deep">
                  <td className="px-4 py-2">
                    <Link
                      href={`/wedstrijden/${result.id}`}
                      className="font-medium text-moss-ink hover:underline"
                    >
                      {result.show_name}
                    </Link>
                  </td>
                  <td className="px-4 py-2 text-ink-soft">{result.show_date}</td>
                  <td className="px-4 py-2 text-ink-soft">
                    {result.bird ? formatBirdLabel(result.bird) : "-"}
                  </td>
                  <td className="px-4 py-2 text-ink-soft">{result.ranking ?? "-"}</td>
                  <td className="px-4 py-2 text-ink-soft">{result.points ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
