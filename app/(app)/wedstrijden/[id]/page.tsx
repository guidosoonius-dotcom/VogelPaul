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
          <h1 className="text-2xl font-semibold text-zinc-900">{result.show_name}</h1>
          <p className="text-sm text-zinc-600">
            {result.show_date}
            {result.location ? ` · ${result.location}` : ""}
          </p>
        </div>
        <Link href={`/wedstrijden/${id}/bewerken`}>
          <Button variant="secondary">Bewerken</Button>
        </Link>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <section className="rounded-md border border-zinc-200 bg-white p-4">
          <dl className="space-y-1 text-sm text-zinc-700">
            <div className="flex justify-between">
              <dt className="text-zinc-500">Vogel</dt>
              <dd>
                {result.bird ? (
                  <Link
                    href={`/vogels/${result.bird.id}`}
                    className="text-emerald-800 hover:underline"
                  >
                    {formatBirdLabel(result.bird)}
                  </Link>
                ) : (
                  "-"
                )}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-zinc-500">Categorie/klasse</dt>
              <dd>{result.category ?? "-"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-zinc-500">Punten/score</dt>
              <dd>{result.points ?? "-"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-zinc-500">Klassering</dt>
              <dd>{result.ranking ?? "-"}</dd>
            </div>
          </dl>
        </section>

        {photoUrl && (
          <section className="rounded-md border border-zinc-200 bg-white p-4">
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
        <section className="mt-6 rounded-md border border-zinc-200 bg-white p-4">
          <h2 className="text-sm font-medium text-zinc-800">Notities</h2>
          <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-700">{result.notes}</p>
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
