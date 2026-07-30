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
      <h1 className="text-2xl font-semibold text-zinc-900">Nieuwe vogel</h1>
      <div className="mt-6 max-w-2xl rounded-md border border-zinc-200 bg-white p-6">
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
