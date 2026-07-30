import { listBirdOptions } from "@/lib/queries/birds";
import CompetitionForm from "@/components/competitions/CompetitionForm";
import { createCompetitionResult } from "../actions";

export default async function NieuwWedstrijdresultaatPage({
  searchParams,
}: {
  searchParams: Promise<{ bird?: string }>;
}) {
  const { bird: fixedBirdId } = await searchParams;
  const birds = await listBirdOptions();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-zinc-900">Nieuw wedstrijdresultaat</h1>
      <div className="mt-6 max-w-2xl rounded-md border border-zinc-200 bg-white p-6">
        <CompetitionForm
          birds={birds}
          action={createCompetitionResult}
          submitLabel="Resultaat toevoegen"
          fixedBirdId={fixedBirdId}
        />
      </div>
    </div>
  );
}
