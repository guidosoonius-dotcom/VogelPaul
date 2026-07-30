import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBirdById, getOffspringOf } from "@/lib/queries/birds";
import { listCompetitionResults } from "@/lib/queries/competitions";
import { getSignedPhotoUrl } from "@/lib/storage/photos";
import { formatBirdLabel, formatSex, formatStatus } from "@/lib/domain/birdLabel";
import { Button } from "@/components/ui/Button";

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
            <h1 className="text-2xl font-semibold text-zinc-900">
              {formatBirdLabel(bird)}
            </h1>
            <p className="text-sm text-zinc-600">
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
        <section className="rounded-md border border-zinc-200 bg-white p-4">
          <h2 className="text-sm font-medium text-zinc-800">Ringgegevens</h2>
          <dl className="mt-2 space-y-1 text-sm text-zinc-700">
            <div className="flex justify-between">
              <dt className="text-zinc-500">Ringnummer</dt>
              <dd>{bird.ring_number ?? "-"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-zinc-500">Jaar</dt>
              <dd>{bird.ring_year ?? "-"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-zinc-500">Kleur</dt>
              <dd>
                {bird.ring_color ?? "-"}
                {bird.ring_color_overridden && (
                  <span className="ml-1 rounded bg-amber-100 px-1.5 py-0.5 text-xs text-amber-800">
                    aangepast
                  </span>
                )}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-zinc-500">Vereniging</dt>
              <dd>{bird.ring_federation_code ?? "-"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-zinc-500">Geboortedatum</dt>
              <dd>{bird.birth_date ?? "-"}</dd>
            </div>
          </dl>
        </section>

        <section className="rounded-md border border-zinc-200 bg-white p-4">
          <h2 className="text-sm font-medium text-zinc-800">Afstamming</h2>
          <dl className="mt-2 space-y-1 text-sm text-zinc-700">
            <div className="flex justify-between">
              <dt className="text-zinc-500">Vader</dt>
              <dd>
                {bird.father ? (
                  <Link href={`/vogels/${bird.father.id}`} className="text-emerald-800 hover:underline">
                    {formatBirdLabel(bird.father)}
                  </Link>
                ) : (
                  "Onbekend"
                )}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-zinc-500">Moeder</dt>
              <dd>
                {bird.mother ? (
                  <Link href={`/vogels/${bird.mother.id}`} className="text-emerald-800 hover:underline">
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
        <section className="mt-6 rounded-md border border-zinc-200 bg-white p-4">
          <h2 className="text-sm font-medium text-zinc-800">Notities</h2>
          <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-700">{bird.notes}</p>
        </section>
      )}

      <section className="mt-6 rounded-md border border-zinc-200 bg-white p-4">
        <h2 className="text-sm font-medium text-zinc-800">
          Nakomelingen ({offspring.length})
        </h2>
        {offspring.length === 0 ? (
          <p className="mt-2 text-sm text-zinc-600">Nog geen nakomelingen geregistreerd.</p>
        ) : (
          <ul className="mt-2 divide-y divide-zinc-100 text-sm">
            {offspring.map((child) => (
              <li key={child.id} className="flex justify-between py-2">
                <Link href={`/vogels/${child.id}`} className="text-emerald-800 hover:underline">
                  {formatBirdLabel(child)}
                </Link>
                <span className="text-zinc-500">{formatSex(child.sex)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-6 rounded-md border border-zinc-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-zinc-800">
            Wedstrijdresultaten ({competitionResults.length})
          </h2>
          <Link
            href={`/wedstrijden/nieuw?bird=${id}`}
            className="text-sm text-emerald-800 hover:underline"
          >
            Resultaat toevoegen
          </Link>
        </div>
        {competitionResults.length === 0 ? (
          <p className="mt-2 text-sm text-zinc-600">
            Nog geen wedstrijdresultaten geregistreerd.
          </p>
        ) : (
          <ul className="mt-2 divide-y divide-zinc-100 text-sm">
            {competitionResults.map((result) => (
              <li key={result.id} className="flex justify-between py-2">
                <Link
                  href={`/wedstrijden/${result.id}`}
                  className="text-emerald-800 hover:underline"
                >
                  {result.show_name} ({result.show_date})
                </Link>
                <span className="text-zinc-500">{result.ranking ?? result.points ?? "-"}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
