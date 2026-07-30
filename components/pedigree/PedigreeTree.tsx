import Link from "next/link";
import { formatBirdLabel, formatSex } from "@/lib/domain/birdLabel";
import type { AncestorRow } from "@/lib/queries/pedigree";

export interface PedigreeRootBird {
  id: string;
  name: string | null;
  ring_number: string | null;
  ring_year: number | null;
  ring_color: string | null;
  sex: "male" | "female" | "unknown";
}

export default function PedigreeTree({
  rootBird,
  ancestorsByRelation,
  maxDepth = 4,
}: {
  rootBird: PedigreeRootBird;
  ancestorsByRelation: Record<string, AncestorRow>;
  maxDepth?: number;
}) {
  return (
    <div className="overflow-x-auto">
      <PedigreeNode
        bird={rootBird}
        relation=""
        depth={0}
        maxDepth={maxDepth}
        ancestorsByRelation={ancestorsByRelation}
        isRoot
      />
    </div>
  );
}

function PedigreeNode({
  bird,
  relation,
  depth,
  maxDepth,
  ancestorsByRelation,
  isRoot = false,
}: {
  bird: PedigreeRootBird | AncestorRow | null;
  relation: string;
  depth: number;
  maxDepth: number;
  ancestorsByRelation: Record<string, AncestorRow>;
  isRoot?: boolean;
}) {
  const hasMoreGenerations = depth < maxDepth;

  const fatherRelation = relation ? `${relation}_father` : "father";
  const motherRelation = relation ? `${relation}_mother` : "mother";
  const father = ancestorsByRelation[fatherRelation] ?? null;
  const mother = ancestorsByRelation[motherRelation] ?? null;

  return (
    <div className="flex items-stretch gap-3">
      <PedigreeCell bird={bird} isRoot={isRoot} />
      {hasMoreGenerations && (
        <div className="flex flex-col justify-around gap-3 border-l border-zinc-200 pl-3">
          <PedigreeNode
            bird={father}
            relation={fatherRelation}
            depth={depth + 1}
            maxDepth={maxDepth}
            ancestorsByRelation={ancestorsByRelation}
          />
          <PedigreeNode
            bird={mother}
            relation={motherRelation}
            depth={depth + 1}
            maxDepth={maxDepth}
            ancestorsByRelation={ancestorsByRelation}
          />
        </div>
      )}
    </div>
  );
}

function PedigreeCell({
  bird,
  isRoot,
}: {
  bird: PedigreeRootBird | AncestorRow | null;
  isRoot: boolean;
}) {
  if (!bird) {
    return (
      <div className="flex w-40 shrink-0 items-center justify-center rounded-md border border-dashed border-zinc-300 bg-zinc-50 p-3 text-xs text-zinc-400">
        Onbekend
      </div>
    );
  }

  const content = (
    <div
      className={`w-40 shrink-0 rounded-md border p-3 text-xs ${
        isRoot ? "border-emerald-300 bg-emerald-50" : "border-zinc-200 bg-white"
      }`}
    >
      <div className="font-medium text-zinc-900">{formatBirdLabel(bird)}</div>
      <div className="mt-1 text-zinc-500">{formatSex(bird.sex)}</div>
      {bird.ring_color && <div className="text-zinc-500">Ring: {bird.ring_color}</div>}
    </div>
  );

  return isRoot ? (
    content
  ) : (
    <Link href={`/vogels/${bird.id}`} className="hover:opacity-80">
      {content}
    </Link>
  );
}
