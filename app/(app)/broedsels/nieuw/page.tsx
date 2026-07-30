import { notFound } from "next/navigation";
import { getPairById } from "@/lib/queries/pairs";
import { formatBirdLabel } from "@/lib/domain/birdLabel";
import BroodForm from "@/components/broods/BroodForm";
import { createBrood } from "../actions";

export default async function NieuwBroedselPage({
  searchParams,
}: {
  searchParams: Promise<{ pair?: string }>;
}) {
  const { pair: pairId } = await searchParams;
  if (!pairId) notFound();

  let pair;
  try {
    pair = await getPairById(pairId);
  } catch {
    notFound();
  }
  if (!pair) notFound();

  const createBroodForPair = createBrood.bind(null, pairId);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-zinc-900">Nieuw broedsel</h1>
      <p className="mt-1 text-sm text-zinc-600">
        Koppel: {pair.male_bird ? formatBirdLabel(pair.male_bird) : "?"} &times;{" "}
        {pair.female_bird ? formatBirdLabel(pair.female_bird) : "?"}
      </p>
      <div className="mt-6 max-w-2xl rounded-md border border-zinc-200 bg-white p-6">
        <BroodForm action={createBroodForPair} submitLabel="Broedsel toevoegen" />
      </div>
    </div>
  );
}
