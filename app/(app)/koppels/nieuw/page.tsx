import Link from "next/link";
import { listBirdOptions } from "@/lib/queries/birds";
import PairForm from "@/components/pairs/PairForm";
import { createPair } from "../actions";

export default async function NieuwKoppelPage() {
  const [maleBirds, femaleBirds] = await Promise.all([
    listBirdOptions({ sex: "male", status: "active" }),
    listBirdOptions({ sex: "female", status: "active" }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink">Nieuw koppel</h1>
      {maleBirds.length === 0 || femaleBirds.length === 0 ? (
        <p className="mt-6 text-sm text-ink-soft">
          Je hebt minstens één actieve man en één actieve pop nodig om een
          koppel te vormen.{" "}
          <Link href="/vogels/nieuw" className="text-moss-ink hover:underline">
            Voeg een vogel toe
          </Link>
          .
        </p>
      ) : (
        <div className="mt-6 max-w-2xl rounded-3xl border border-line-soft bg-card p-6">
          <PairForm maleBirds={maleBirds} femaleBirds={femaleBirds} action={createPair} />
        </div>
      )}
    </div>
  );
}
