import Link from "next/link";
import { notFound } from "next/navigation";
import { getBirdById } from "@/lib/queries/birds";
import { ancestorsByRelation, getAncestors } from "@/lib/queries/pedigree";
import { formatBirdLabel } from "@/lib/domain/birdLabel";
import PedigreeTree from "@/components/pedigree/PedigreeTree";

const MAX_DEPTH = 4;

export default async function StamboomPage({
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

  const ancestors = await getAncestors(id, MAX_DEPTH);
  const byRelation = ancestorsByRelation(ancestors);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-ink">
          Stamboom van {formatBirdLabel(bird)}
        </h1>
        <Link href={`/vogels/${id}`} className="text-sm text-moss-ink hover:underline">
          &larr; Terug naar vogel
        </Link>
      </div>
      <p className="mt-1 text-sm text-ink-soft">
        Tot {MAX_DEPTH} generaties terug. Onbekende voorouders worden getoond als
        &quot;Onbekend&quot;.
      </p>

      <div className="mt-6 rounded-3xl border border-line-soft bg-card p-4">
        <PedigreeTree rootBird={bird} ancestorsByRelation={byRelation} maxDepth={MAX_DEPTH} />
      </div>
    </div>
  );
}
