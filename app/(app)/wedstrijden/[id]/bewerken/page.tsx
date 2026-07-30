import { notFound } from "next/navigation";
import { getCompetitionResultById } from "@/lib/queries/competitions";
import { listBirdOptions } from "@/lib/queries/birds";
import CompetitionForm from "@/components/competitions/CompetitionForm";
import { updateCompetitionResult } from "../../actions";

export default async function WedstrijdresultaatBewerkenPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let result;
  try {
    result = await getCompetitionResultById(id);
  } catch {
    notFound();
  }
  if (!result) notFound();

  const birds = await listBirdOptions();
  const updateResultWithId = updateCompetitionResult.bind(null, id);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-zinc-900">Resultaat bewerken</h1>
      <div className="mt-6 max-w-2xl rounded-md border border-zinc-200 bg-white p-6">
        <CompetitionForm
          birds={birds}
          initialData={result}
          action={updateResultWithId}
          submitLabel="Wijzigingen opslaan"
        />
      </div>
    </div>
  );
}
