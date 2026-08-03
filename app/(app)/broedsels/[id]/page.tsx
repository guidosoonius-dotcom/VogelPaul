import Link from "next/link";
import { notFound } from "next/navigation";
import { getBroodById } from "@/lib/queries/broods";
import { getOffspringOfBrood } from "@/lib/queries/birds";
import { getSpeciesById } from "@/lib/queries/species";
import { formatBirdLabel, formatSex } from "@/lib/domain/birdLabel";
import { Button } from "@/components/ui/Button";
import ConfirmDeleteForm from "@/components/ui/ConfirmDeleteForm";
import StatTile from "@/components/ui/StatTile";
import RegisterOffspringForm from "@/components/broods/RegisterOffspringForm";
import { deleteBrood, registerOffspring } from "../actions";

export default async function BroedselDetailPage({
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

  const [offspring, species] = await Promise.all([
    getOffspringOfBrood(id),
    getSpeciesById(brood.species_id),
  ]);

  const registerOffspringForBrood = registerOffspring.bind(null, id);
  const deleteBroodForPair = deleteBrood.bind(null, brood.pair_id, id);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">
            Broedsel {brood.clutch_started_at ?? ""}
          </h1>
          <p className="text-sm text-ink-soft">
            Koppel:{" "}
            <Link href={`/koppels/${brood.pair_id}`} className="text-moss-ink hover:underline">
              {brood.pair?.male_bird ? formatBirdLabel(brood.pair.male_bird) : "?"} &times;{" "}
              {brood.pair?.female_bird ? formatBirdLabel(brood.pair.female_bird) : "?"}
            </Link>
          </p>
        </div>
        <Link href={`/broedsels/${id}/bewerken`}>
          <Button variant="secondary">Bewerken</Button>
        </Link>
      </div>

      <section className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatTile label="Eieren gelegd" value={brood.eggs_laid} />
        <StatTile label="Bevrucht" value={brood.eggs_fertilized ?? "-"} />
        <StatTile label="Uitgekomen" value={brood.eggs_hatched} />
        <StatTile label="Uitgevlogen" value={brood.chicks_fledged} />
      </section>

      {brood.notes && (
        <section className="mt-6 rounded-lg border border-line-soft bg-card p-4">
          <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-ink-faint">Notities</h2>
          <p className="mt-2 whitespace-pre-wrap text-sm text-ink-soft">{brood.notes}</p>
        </section>
      )}

      <section className="mt-6 rounded-lg border border-line-soft bg-card p-4">
        <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-ink-faint">
          Nakomelingen ({offspring.length})
        </h2>
        {offspring.length === 0 ? (
          <p className="mt-2 text-sm text-ink-soft">
            Nog geen nakomelingen als vogel geregistreerd.
          </p>
        ) : (
          <ul className="mt-2 divide-y divide-line-soft text-sm">
            {offspring.map((child) => (
              <li key={child.id} className="flex justify-between py-2 rounded-md px-2.5 -mx-2.5 transition-[background-color,transform] duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] hover:translate-x-0.5 hover:bg-ground-deep">
                <Link href={`/vogels/${child.id}`} className="text-moss-ink hover:underline">
                  {formatBirdLabel(child)}
                </Link>
                <span className="text-ink-faint">{formatSex(child.sex)}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-4 border-t border-line-soft pt-4">
          <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-ink-faint">
            Nakomeling toevoegen
          </h3>
          <div className="mt-2">
            <RegisterOffspringForm species={species} action={registerOffspringForBrood} />
          </div>
        </div>
      </section>

      <ConfirmDeleteForm
        action={deleteBroodForPair}
        confirmMessage="Weet je zeker dat je dit broedsel wilt verwijderen?"
        label="Broedsel verwijderen"
        className="mt-6"
      />
    </div>
  );
}
