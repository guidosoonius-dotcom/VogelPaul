import { getSpeciesList } from "@/lib/queries/species";
import { listBirdOptions } from "@/lib/queries/birds";
import BirdForm from "@/components/birds/BirdForm";
import { createBird } from "../actions";

export default async function NieuweVogelPage() {
  const [species, birdOptions] = await Promise.all([
    getSpeciesList(),
    listBirdOptions(),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink">Nieuwe vogel</h1>
      <div className="mt-6 max-w-2xl rounded-3xl border border-line-soft bg-card p-6">
        <BirdForm
          species={species}
          birdOptions={birdOptions}
          action={createBird}
          submitLabel="Vogel toevoegen"
        />
      </div>
    </div>
  );
}
