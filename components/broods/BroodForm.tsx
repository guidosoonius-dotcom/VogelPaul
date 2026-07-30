"use client";

import { Button } from "@/components/ui/Button";
import { FieldWrapper, Input, Textarea } from "@/components/ui/Field";

export interface BroodFormInitialData {
  clutch_started_at: string | null;
  eggs_laid: number;
  eggs_fertilized: number | null;
  eggs_hatched: number;
  chicks_fledged: number;
  notes: string | null;
}

export default function BroodForm({
  initialData,
  action,
  submitLabel = "Broedsel opslaan",
}: {
  initialData?: BroodFormInitialData;
  action: (formData: FormData) => Promise<void>;
  submitLabel?: string;
}) {
  const data = initialData;

  return (
    <form action={action} className="space-y-4">
      <FieldWrapper label="Startdatum legsel" htmlFor="clutch_started_at">
        <Input
          id="clutch_started_at"
          name="clutch_started_at"
          type="date"
          defaultValue={data?.clutch_started_at ?? ""}
        />
      </FieldWrapper>

      <div className="grid gap-4 sm:grid-cols-4">
        <FieldWrapper label="Eieren gelegd" htmlFor="eggs_laid">
          <Input
            id="eggs_laid"
            name="eggs_laid"
            type="number"
            min={0}
            defaultValue={data?.eggs_laid ?? 0}
          />
        </FieldWrapper>
        <FieldWrapper label="Bevrucht" htmlFor="eggs_fertilized">
          <Input
            id="eggs_fertilized"
            name="eggs_fertilized"
            type="number"
            min={0}
            defaultValue={data?.eggs_fertilized ?? ""}
          />
        </FieldWrapper>
        <FieldWrapper label="Uitgekomen" htmlFor="eggs_hatched">
          <Input
            id="eggs_hatched"
            name="eggs_hatched"
            type="number"
            min={0}
            defaultValue={data?.eggs_hatched ?? 0}
          />
        </FieldWrapper>
        <FieldWrapper label="Uitgevlogen" htmlFor="chicks_fledged">
          <Input
            id="chicks_fledged"
            name="chicks_fledged"
            type="number"
            min={0}
            defaultValue={data?.chicks_fledged ?? 0}
          />
        </FieldWrapper>
      </div>

      <FieldWrapper label="Notities" htmlFor="notes">
        <Textarea id="notes" name="notes" rows={3} defaultValue={data?.notes ?? ""} />
      </FieldWrapper>

      <div className="flex justify-end">
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}
