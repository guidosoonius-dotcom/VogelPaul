import { notFound } from "next/navigation";
import { getCompetitionResultById } from "@/lib/queries/competitions";
import { listBirdOptions } from "@/lib/queries/birds";
import { getSignedPhotoUrl } from "@/lib/storage/photos";
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

  const [birds, currentPhotoUrl] = await Promise.all([
    listBirdOptions(),
    getSignedPhotoUrl("competition-photos", result.photo_url),
  ]);
  const updateResultWithId = updateCompetitionResult.bind(null, id);

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink">Resultaat bewerken</h1>
      <div className="mt-6 max-w-2xl rounded-lg border border-line-soft bg-card p-6">
        <CompetitionForm
          birds={birds}
          initialData={result}
          currentPhotoUrl={currentPhotoUrl}
          action={updateResultWithId}
          submitLabel="Wijzigingen opslaan"
        />
      </div>
    </div>
  );
}
