import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBirdById, getOffspringOf } from "@/lib/queries/birds";
import { listCompetitionResults } from "@/lib/queries/competitions";
import { getSignedPhotoUrl } from "@/lib/storage/photos";
import { formatBirdLabel, formatSex, formatStatus } from "@/lib/domain/birdLabel";
import { Button } from "@/components/ui/Button";
import RingColorChip from "@/components/ui/RingColorChip";

export default async function VogelDetailPage({
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

  const [offspring, competitionResults, photoUrl] = await Promise.all([
    getOffspringOf(id),
    listCompetitionResults({ birdId: id }),
    getSignedPhotoUrl("bird-photos", bird.photo_url),
  ]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {photoUrl && (
            <Image
              src={photoUrl}
              alt={formatBirdLabel(bird)}
              width={64}
              height={64}
              unoptimized
              className="h-16 w-16 rounded-full object-cover"
            />
          )}
          <div>
            <h1 className="text-2xl font-bold text-ink">
              {formatBirdLabel(bird)}
            </h1>
            <p className="text-sm text-ink-soft">
              {bird.species?.name_nl} &middot; {formatSex(bird.sex)} &middot;{" "}
              {formatStatus(bird.status)}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/vogels/${id}/stamboom`}>
            <Button variant="secondary">Stamboom</Button>
          </Link>
          <Link href={`/vogels/${id}/bewerken`}>
            <Button variant="secondary">Bewerken</Button>
          </Link>
        </div>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <section className="rounded-3xl border border-line-soft bg-card p-4">
          <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-ink-faint">Ringgegevens</h2>
          <dl className="mt-2 space-y-1 text-sm text-ink-soft">
            <div className="flex justify-between">
              <dt className="text-ink-faint">Ringnummer</dt>
              <dd>{bird.ring_number ?? "-"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-faint">Jaar</dt>
              <dd>{bird.ring_year ?? "-"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-faint">Kleur</dt>
              <dd>
                <RingColorChip color={bird.ring_color} />
                {bird.ring_color_overridden && (
                  <span className="ml-1 rounded-full bg-brass-tint px-1.5 py-0.5 text-xs font-bold text-brass">
                    aangepast
                  </span>
                )}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-faint">Vereniging</dt>
              <dd>{bird.ring_federation_code ?? "-"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-faint">Geboortedatum</dt>
              <dd>{bird.birth_date ?? "-"}</dd>
            </div>
          </dl>
        </section>

        <section className="rounded-3xl border border-line-soft bg-card p-4">
          <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-ink-faint">Afstamming</h2>
          <dl className="mt-2 space-y-1 text-sm text-ink-soft">
            <div className="flex justify-between">
              <dt className="text-ink-faint">Vader</dt>
              <dd>
                {bird.father ? (
                  <Link href={`/vogels/${bird.father.id}`} className="text-moss-ink hover:underline">
                    {formatBirdLabel(bird.father)}
                  </Link>
                ) : (
                  "Onbekend"
                )}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-faint">Moeder</dt>
              <dd>
                {bird.mother ? (
                  <Link href={`/vogels/${bird.mother.id}`} className="text-moss-ink hover:underline">
                    {formatBirdLabel(bird.mother)}
                  </Link>
                ) : (
                  "Onbekend"
                )}
              </dd>
            </div>
          </dl>
        </section>
      </div>

      {bird.notes && (
        <section className="mt-6 rounded-3xl border border-line-soft bg-card p-4">
          <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-ink-faint">Notities</h2>
          <p className="mt-2 whitespace-pre-wrap text-sm text-ink-soft">{bird.notes}</p>
        </section>
      )}

      <section className="mt-6 rounded-3xl border border-line-soft bg-card p-4">
        <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-ink-faint">
          Nakomelingen ({offspring.length})
        </h2>
        {offspring.length === 0 ? (
          <p className="mt-2 text-sm text-ink-soft">Nog geen nakomelingen geregistreerd.</p>
        ) : (
          <ul className="mt-2 divide-y divide-line-soft text-sm">
            {offspring.map((child) => (
              <li key={child.id} className="flex justify-between py-2 rounded-xl px-2.5 -mx-2.5 transition-[background-color,transform] duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] hover:translate-x-0.5 hover:bg-ground-deep">
                <Link href={`/vogels/${child.id}`} className="text-moss-ink hover:underline">
                  {formatBirdLabel(child)}
                </Link>
                <span className="text-ink-faint">{formatSex(child.sex)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-6 rounded-3xl border border-line-soft bg-card p-4">
        <div className="flex items-center justify-between">
          <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-ink-faint">
            Wedstrijdresultaten ({competitionResults.length})
          </h2>
          <Link
            href={`/wedstrijden/nieuw?bird=${id}`}
            className="text-sm text-moss-ink hover:underline"
          >
            Resultaat toevoegen
          </Link>
        </div>
        {competitionResults.length === 0 ? (
          <p className="mt-2 text-sm text-ink-soft">
            Nog geen wedstrijdresultaten geregistreerd.
          </p>
        ) : (
          <ul className="mt-2 divide-y divide-line-soft text-sm">
            {competitionResults.map((result) => (
              <li key={result.id} className="flex justify-between py-2 rounded-xl px-2.5 -mx-2.5 transition-[background-color,transform] duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] hover:translate-x-0.5 hover:bg-ground-deep">
                <Link
                  href={`/wedstrijden/${result.id}`}
                  className="text-moss-ink hover:underline"
                >
                  {result.show_name} ({result.show_date})
                </Link>
                <span className="text-ink-faint">{result.ranking ?? result.points ?? "-"}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
