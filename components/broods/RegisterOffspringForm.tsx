"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { FieldWrapper, Input, Select } from "@/components/ui/Field";
import { computeCanaryRingColor } from "@/lib/domain/ringColor";
import type { SpeciesOption } from "@/components/birds/BirdForm";

export default function RegisterOffspringForm({
  species,
  action,
}: {
  species: SpeciesOption;
  action: (formData: FormData) => Promise<void>;
}) {
  const [ringYear, setRingYear] = useState(new Date().getFullYear().toString());
  const [ringColor, setRingColor] = useState("");
  const [overridden, setOverridden] = useState(false);

  const suggestedColor = useMemo(() => {
    if (!species.ring_color_cycle_enabled || species.code !== "canary") return null;
    const year = Number.parseInt(ringYear, 10);
    if (Number.isNaN(year)) return null;
    return computeCanaryRingColor(year, {
      cycleLength: species.ring_color_cycle_length,
      startYear: species.ring_color_cycle_start_year ?? year,
    });
  }, [species, ringYear]);

  const effectiveColor = overridden ? ringColor : suggestedColor ?? ringColor;

  return (
    <form action={action} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <FieldWrapper label="Naam (optioneel)" htmlFor="offspring_name">
          <Input id="offspring_name" name="name" />
        </FieldWrapper>
        <FieldWrapper label="Geslacht" htmlFor="offspring_sex">
          <Select id="offspring_sex" name="sex" defaultValue="unknown">
            <option value="unknown">Onbekend</option>
            <option value="male">Man</option>
            <option value="female">Pop</option>
          </Select>
        </FieldWrapper>
        <FieldWrapper label="Geboortedatum" htmlFor="offspring_birth_date">
          <Input
            id="offspring_birth_date"
            name="birth_date"
            type="date"
            max={new Date().toISOString().slice(0, 10)}
          />
        </FieldWrapper>
        <FieldWrapper label="Ringnummer" htmlFor="offspring_ring_number">
          <Input id="offspring_ring_number" name="ring_number" />
        </FieldWrapper>
        <FieldWrapper label="Jaar" htmlFor="offspring_ring_year">
          <Input
            id="offspring_ring_year"
            name="ring_year"
            type="number"
            min={1990}
            max={new Date().getFullYear() + 1}
            value={ringYear}
            onChange={(e) => setRingYear(e.target.value)}
          />
        </FieldWrapper>
        <FieldWrapper
          label="Kleur"
          htmlFor="offspring_ring_color"
          hint={
            suggestedColor && !overridden
              ? `Voorgestelde kleur op basis van jaar: ${suggestedColor}`
              : undefined
          }
        >
          <Input
            id="offspring_ring_color"
            name="ring_color"
            value={effectiveColor}
            onChange={(e) => {
              setRingColor(e.target.value);
              setOverridden(true);
            }}
            placeholder={suggestedColor ?? "bv. groen"}
          />
        </FieldWrapper>
        <FieldWrapper label="Verenigingscode" htmlFor="offspring_ring_federation_code">
          <Input id="offspring_ring_federation_code" name="ring_federation_code" />
        </FieldWrapper>
      </div>
      <div className="flex justify-end">
        <Button type="submit">Nakomeling toevoegen</Button>
      </div>
    </form>
  );
}
