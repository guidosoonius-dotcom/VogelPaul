import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCompetitionResultById } from "@/lib/queries/competitions";
import { getSignedPhotoUrl } from "@/lib/storage/photos";
import { formatBirdLabel } from "@/lib/domain/birdLabel";
import { Button } from "@/components/ui/Button";
import ConfirmDeleteForm from "@/components/ui/ConfirmDeleteForm";
import { deleteCompetitionResult } from "../actions";

export default async function WedstrijdresultaatDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let result;
  try {
    result = await getCompetitionResultById(id);
  } catch {
    notFound();
  }
  if (!result) notFound();

  const photoUrl = await getSignedPhotoUrl("competition-photos", result.photo_url);
  const deleteResultForBird = deleteCompetitionResult.bind(null, result.bird_id, id);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">{result.show_name}</h1>
          <p className="text-sm text-ink-soft">
            {result.show_date}
            {result.location ? ` · ${result.location}` : ""}
          </p>
        </div>
        <Link href={`/wedstrijden/${id}/bewerken`}>
          <Button variant="secondary">Bewerken</Button>
        </Link>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <section className="rounded-lg border border-line-soft bg-card p-4">
          <dl className="space-y-1 text-sm text-ink-soft">
            <div className="flex justify-between">
              <dt className="text-ink-faint">Vogel</dt>
              <dd>
                {result.bird ? (
                  <Link
                    href={`/vogels/${result.bird.id}`}
                    className="text-moss-ink hover:underline"
                  >
                    {formatBirdLabel(result.bird)}
                  </Link>
                ) : (
                  "-"
                )}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-faint">Categorie/klasse</dt>
              <dd>{result.category ?? "-"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-faint">Punten/score</dt>
              <dd>{result.points ?? "-"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-faint">Klassering</dt>
              <dd>{result.ranking ?? "-"}</dd>
            </div>
          </dl>
        </section>

        {photoUrl && (
          <section className="rounded-lg border border-line-soft bg-card p-4">
            <Image
              src={photoUrl}
              alt={`Foto bij ${result.show_name}`}
              width={400}
              height={400}
              unoptimized
              className="h-auto w-full rounded-md object-cover"
            />
          </section>
        )}
      </div>

      {result.notes && (
        <section className="mt-6 rounded-lg border border-line-soft bg-card p-4">
          <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-ink-faint">Notities</h2>
          <p className="mt-2 whitespace-pre-wrap text-sm text-ink-soft">{result.notes}</p>
        </section>
      )}

      <ConfirmDeleteForm
        action={deleteResultForBird}
        confirmMessage="Weet je zeker dat je dit wedstrijdresultaat wilt verwijderen?"
        label="Resultaat verwijderen"
        className="mt-6"
      />
    </div>
  );
}
