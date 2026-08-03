import { notFound } from "next/navigation";
import { getBroodById } from "@/lib/queries/broods";
import BroodForm from "@/components/broods/BroodForm";
import { updateBrood } from "../../actions";

export default async function BroedselBewerkenPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let brood;
  try {
    brood = await getBroodById(id);
  } catch {
    notFound();
  }
  if (!brood) notFound();

  const updateBroodWithId = updateBrood.bind(null, id);

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink">Broedsel bewerken</h1>
      <div className="mt-6 max-w-2xl rounded-lg border border-line-soft bg-card p-6">
        <BroodForm
          initialData={brood}
          action={updateBroodWithId}
          submitLabel="Wijzigingen opslaan"
        />
      </div>
    </div>
  );
}
