"use client";

import { Button } from "@/components/ui/Button";
import { FieldWrapper, Input, Select, Textarea } from "@/components/ui/Field";
import { formatBirdLabel } from "@/lib/domain/birdLabel";
import type { BirdOption } from "@/components/birds/BirdForm";

export default function PairForm({
  maleBirds,
  femaleBirds,
  action,
}: {
  maleBirds: BirdOption[];
  femaleBirds: BirdOption[];
  action: (formData: FormData) => Promise<void>;
}) {
  return (
    <form action={action} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <FieldWrapper label="Man" htmlFor="male_bird_id">
          <Select id="male_bird_id" name="male_bird_id" required defaultValue="">
            <option value="" disabled>
              Kies een vogel
            </option>
            {maleBirds.map((b) => (
              <option key={b.id} value={b.id}>
                {formatBirdLabel(b)}
              </option>
            ))}
          </Select>
        </FieldWrapper>
        <FieldWrapper label="Pop" htmlFor="female_bird_id">
          <Select id="female_bird_id" name="female_bird_id" required defaultValue="">
            <option value="" disabled>
              Kies een vogel
            </option>
            {femaleBirds.map((b) => (
              <option key={b.id} value={b.id}>
                {formatBirdLabel(b)}
              </option>
            ))}
          </Select>
        </FieldWrapper>
      </div>
      <FieldWrapper label="Startdatum" htmlFor="started_at">
        <Input
          id="started_at"
          name="started_at"
          type="date"
          defaultValue={new Date().toISOString().slice(0, 10)}
        />
      </FieldWrapper>
      <FieldWrapper label="Notities" htmlFor="notes">
        <Textarea id="notes" name="notes" rows={3} />
      </FieldWrapper>
      <div className="flex justify-end">
        <Button type="submit">Koppel toevoegen</Button>
      </div>
    </form>
  );
}
