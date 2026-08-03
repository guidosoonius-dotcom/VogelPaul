"use client";

import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { FieldWrapper, Input, Select, Textarea } from "@/components/ui/Field";
import { formatBirdLabel } from "@/lib/domain/birdLabel";
import type { BirdOption } from "@/components/birds/BirdForm";

export interface CompetitionFormInitialData {
  bird_id: string;
  show_name: string;
  show_date: string;
  location: string | null;
  category: string | null;
  points: number | null;
  ranking: string | null;
  notes: string | null;
  photo_url: string | null;
}

export default function CompetitionForm({
  birds,
  initialData,
  currentPhotoUrl,
  action,
  submitLabel = "Resultaat opslaan",
  fixedBirdId,
}: {
  birds: BirdOption[];
  initialData?: CompetitionFormInitialData;
  currentPhotoUrl?: string | null;
  action: (formData: FormData) => Promise<void>;
  submitLabel?: string;
  fixedBirdId?: string;
}) {
  const data = initialData;

  return (
    <form action={action} className="space-y-4" encType="multipart/form-data">
      {fixedBirdId ? (
        <input type="hidden" name="bird_id" value={fixedBirdId} />
      ) : (
        <FieldWrapper label="Vogel" htmlFor="bird_id">
          <Select id="bird_id" name="bird_id" required defaultValue={data?.bird_id ?? ""}>
            <option value="" disabled>
              Kies een vogel
            </option>
            {birds.map((b) => (
              <option key={b.id} value={b.id}>
                {formatBirdLabel(b)}
              </option>
            ))}
          </Select>
        </FieldWrapper>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <FieldWrapper label="Wedstrijdnaam" htmlFor="show_name">
          <Input
            id="show_name"
            name="show_name"
            required
            defaultValue={data?.show_name ?? ""}
          />
        </FieldWrapper>
        <FieldWrapper label="Datum" htmlFor="show_date">
          <Input
            id="show_date"
            name="show_date"
            type="date"
            required
            defaultValue={data?.show_date ?? ""}
          />
        </FieldWrapper>
        <FieldWrapper label="Plaats" htmlFor="location">
          <Input id="location" name="location" defaultValue={data?.location ?? ""} />
        </FieldWrapper>
        <FieldWrapper label="Categorie/klasse" htmlFor="category">
          <Input id="category" name="category" defaultValue={data?.category ?? ""} />
        </FieldWrapper>
        <FieldWrapper label="Punten/score" htmlFor="points">
          <Input
            id="points"
            name="points"
            type="number"
            step="any"
            defaultValue={data?.points ?? ""}
          />
        </FieldWrapper>
        <FieldWrapper label="Klassering" htmlFor="ranking">
          <Input
            id="ranking"
            name="ranking"
            placeholder="bv. 1e, ereprijs"
            defaultValue={data?.ranking ?? ""}
          />
        </FieldWrapper>
      </div>

      <FieldWrapper
        label="Foto (optioneel)"
        htmlFor="photo"
        hint={currentPhotoUrl ? "Kies een nieuw bestand om de huidige foto te vervangen." : undefined}
      >
        {currentPhotoUrl && (
          <Image
            src={currentPhotoUrl}
            alt=""
            width={80}
            height={80}
            unoptimized
            className="mb-2 h-20 w-20 rounded-md object-cover"
          />
        )}
        <Input id="photo" name="photo" type="file" accept="image/*" />
      </FieldWrapper>

      <FieldWrapper label="Notities" htmlFor="notes">
        <Textarea id="notes" name="notes" rows={3} defaultValue={data?.notes ?? ""} />
      </FieldWrapper>

      <div className="flex justify-end">
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}
