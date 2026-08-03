import { notFound } from "next/navigation";
import { getBirdById } from "@/lib/queries/birds";
import { getSpeciesList } from "@/lib/queries/species";
import { listBirdOptions } from "@/lib/queries/birds";
import { getSignedPhotoUrl } from "@/lib/storage/photos";
import BirdForm from "@/components/birds/BirdForm";
import ConfirmDeleteForm from "@/components/ui/ConfirmDeleteForm";
import { deleteBird, updateBird } from "../../actions";

export default async function VogelBewerkenPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let bird;
  try {
    bird = await getBirdById(id);
  } catch {
    notFound();
  }
  if (!bird) notFound();

  const [species, birdOptions, currentPhotoUrl] = await Promise.all([
    getSpeciesList(),
    listBirdOptions(),
    getSignedPhotoUrl("bird-photos", bird.photo_url),
  ]);

  const updateBirdWithId = updateBird.bind(null, id);
  const deleteBirdWithId = deleteBird.bind(null, id);

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink">Vogel bewerken</h1>
      <div className="mt-6 max-w-2xl rounded-3xl border border-line-soft bg-card p-6">
        <BirdForm
          species={species}
          birdOptions={birdOptions}
          initialData={{ ...bird }}
          currentPhotoUrl={currentPhotoUrl}
          action={updateBirdWithId}
          submitLabel="Wijzigingen opslaan"
        />
      </div>

      <ConfirmDeleteForm
        action={deleteBirdWithId}
        confirmMessage="Weet je zeker dat je deze vogel wilt verwijderen?"
        label="Vogel verwijderen"
        className="mt-4 max-w-2xl"
      />
    </div>
  );
}
