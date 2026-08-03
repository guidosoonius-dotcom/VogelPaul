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
          <h1 className="text-2xl font-bold text-ink">
            {pair.male_bird ? formatBirdLabel(pair.male_bird) : "?"} &times;{" "}
            {pair.female_bird ? formatBirdLabel(pair.female_bird) : "?"}
          </h1>
          <p className="text-sm text-ink-soft">
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
        <section className="mt-6 rounded-3xl border border-line-soft bg-card p-4">
          <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-ink-faint">Notities</h2>
          <p className="mt-2 whitespace-pre-wrap text-sm text-ink-soft">{pair.notes}</p>
        </section>
      )}

      <section className="mt-6 rounded-3xl border border-line-soft bg-card p-4">
        <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-ink-faint">
          Broedsels ({broods.length})
        </h2>
        {broods.length === 0 ? (
          <p className="mt-2 text-sm text-ink-soft">Nog geen broedsels geregistreerd.</p>
        ) : (
          <ul className="mt-2 divide-y divide-line-soft text-sm">
            {broods.map((brood) => (
              <li key={brood.id} className="flex items-center justify-between py-2 rounded-xl px-2.5 -mx-2.5 transition-[background-color,transform] duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] hover:translate-x-0.5 hover:bg-ground-deep">
                <Link
                  href={`/broedsels/${brood.id}`}
                  className="text-moss-ink hover:underline"
                >
                  {brood.clutch_started_at ?? "Datum onbekend"}
                </Link>
                <span className="text-ink-faint">
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
