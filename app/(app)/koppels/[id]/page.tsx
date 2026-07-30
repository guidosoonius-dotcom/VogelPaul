import Link from "next/link";
import { notFound } from "next/navigation";
import { getPairById } from "@/lib/queries/pairs";
import { listBroods } from "@/lib/queries/broods";
import { formatBirdLabel } from "@/lib/domain/birdLabel";
import { Button } from "@/components/ui/Button";
import ConfirmDeleteForm from "@/components/ui/ConfirmDeleteForm";
import { deletePair, endPair } from "../actions";

export default async function KoppelDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let pair;
  try {
    pair = await getPairById(id);
  } catch {
    notFound();
  }
  if (!pair) notFound();

  const broods = await listBroods({ pairId: id });
  const endPairWithId = endPair.bind(null, id);
  const deletePairWithId = deletePair.bind(null, id);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">
            {pair.male_bird ? formatBirdLabel(pair.male_bird) : "?"} &times;{" "}
            {pair.female_bird ? formatBirdLabel(pair.female_bird) : "?"}
          </h1>
          <p className="text-sm text-zinc-600">
            {pair.status === "active" ? "Actief" : "Beëindigd"} sinds {pair.started_at}
            {pair.ended_at ? ` (beëindigd op ${pair.ended_at})` : ""}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href={`/broedsels/nieuw?pair=${id}`}>
            <Button>Nieuw broedsel</Button>
          </Link>
          {pair.status === "active" && (
            <form action={endPairWithId}>
              <Button type="submit" variant="secondary">
                Koppel beëindigen
              </Button>
            </form>
          )}
        </div>
      </div>

      {pair.notes && (
        <section className="mt-6 rounded-md border border-zinc-200 bg-white p-4">
          <h2 className="text-sm font-medium text-zinc-800">Notities</h2>
          <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-700">{pair.notes}</p>
        </section>
      )}

      <section className="mt-6 rounded-md border border-zinc-200 bg-white p-4">
        <h2 className="text-sm font-medium text-zinc-800">
          Broedsels ({broods.length})
        </h2>
        {broods.length === 0 ? (
          <p className="mt-2 text-sm text-zinc-600">Nog geen broedsels geregistreerd.</p>
        ) : (
          <ul className="mt-2 divide-y divide-zinc-100 text-sm">
            {broods.map((brood) => (
              <li key={brood.id} className="flex items-center justify-between py-2">
                <Link
                  href={`/broedsels/${brood.id}`}
                  className="text-emerald-800 hover:underline"
                >
                  {brood.clutch_started_at ?? "Datum onbekend"}
                </Link>
                <span className="text-zinc-500">
                  {brood.eggs_laid} eieren &middot; {brood.eggs_hatched} uitgekomen &middot;{" "}
                  {brood.chicks_fledged} uitgevlogen
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <ConfirmDeleteForm
        action={deletePairWithId}
        confirmMessage="Weet je zeker dat je dit koppel wilt verwijderen? Broedsels van dit koppel worden ook verwijderd."
        label="Koppel verwijderen"
        className="mt-6"
      />
    </div>
  );
}
