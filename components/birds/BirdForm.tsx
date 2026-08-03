"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { FieldWrapper, Input, Select, Textarea } from "@/components/ui/Field";
import { computeCanaryRingColor, getRingColorSwatch } from "@/lib/domain/ringColor";
import { formatBirdLabel } from "@/lib/domain/birdLabel";
import type { BirdSex, BirdStatus } from "@/lib/types/database.types";

export interface SpeciesOption {
  id: string;
  code: string;
  name_nl: string;
  ring_color_cycle_enabled: boolean;
  ring_color_cycle_length: number;
  ring_color_cycle_start_year: number | null;
}

export interface BirdOption {
  id: string;
  name: string | null;
  ring_number: string | null;
  ring_year: number | null;
  sex: BirdSex;
  species_id: string;
}

export interface BirdFormInitialData {
  id?: string;
  species_id: string;
  name: string | null;
  sex: BirdSex;
  birth_date: string | null;
  ring_number: string | null;
  ring_year: number | null;
  ring_color: string | null;
  ring_federation_code: string | null;
  ring_color_overridden: boolean;
  father_id: string | null;
  mother_id: string | null;
  status: BirdStatus;
  notes: string | null;
}

const EMPTY: BirdFormInitialData = {
  species_id: "",
  name: null,
  sex: "unknown",
  birth_date: null,
  ring_number: null,
  ring_year: null,
  ring_color: null,
  ring_federation_code: null,
  ring_color_overridden: false,
  father_id: null,
  mother_id: null,
  status: "active",
  notes: null,
};

export default function BirdForm({
  species,
  birdOptions,
  initialData,
  currentPhotoUrl,
  action,
  submitLabel = "Vogel opslaan",
}: {
  species: SpeciesOption[];
  birdOptions: BirdOption[];
  initialData?: BirdFormInitialData;
  currentPhotoUrl?: string | null;
  action: (formData: FormData) => Promise<void>;
  submitLabel?: string;
}) {
  const data = initialData ?? EMPTY;

  const [speciesId, setSpeciesId] = useState(data.species_id || species[0]?.id || "");
  const [ringYear, setRingYear] = useState(data.ring_year?.toString() ?? "");
  const [ringColor, setRingColor] = useState(data.ring_color ?? "");
  const [overridden, setOverridden] = useState(data.ring_color_overridden);

  const selectedSpecies = species.find((s) => s.id === speciesId);

  const suggestedColor = useMemo(() => {
    if (!selectedSpecies?.ring_color_cycle_enabled) return null;
    const year = Number.parseInt(ringYear, 10);
    if (Number.isNaN(year)) return null;
    if (selectedSpecies.code !== "canary") return null;
    return computeCanaryRingColor(year, {
      cycleLength: selectedSpecies.ring_color_cycle_length,
      startYear: selectedSpecies.ring_color_cycle_start_year ?? year,
    });
  }, [selectedSpecies, ringYear]);

  // Zolang de kweker de kleur niet handmatig heeft aangepast, volgt het
  // veld de suggestie; zodra hij typt in het kleurveld wordt het een
  // overschrijving (zie de select's onChange hieronder).
  const effectiveColor = overridden ? ringColor : suggestedColor ?? ringColor;

  const otherBirds = birdOptions.filter((b) => b.id !== data.id);
  const fatherCandidates = otherBirds.filter((b) => b.sex !== "female");
  const motherCandidates = otherBirds.filter((b) => b.sex !== "male");

  return (
    <form action={action} className="space-y-6" encType="multipart/form-data">
      <div className="grid gap-4 sm:grid-cols-2">
        <FieldWrapper label="Soort" htmlFor="species_id">
          <Select
            id="species_id"
            name="species_id"
            required
            value={speciesId}
            onChange={(e) => setSpeciesId(e.target.value)}
          >
            {species.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name_nl}
              </option>
            ))}
          </Select>
        </FieldWrapper>

        <FieldWrapper label="Naam (optioneel)" htmlFor="name">
          <Input id="name" name="name" defaultValue={data.name ?? ""} />
        </FieldWrapper>

        <FieldWrapper label="Geslacht" htmlFor="sex">
          <Select id="sex" name="sex" defaultValue={data.sex}>
            <option value="unknown">Onbekend</option>
            <option value="male">Man</option>
            <option value="female">Pop</option>
          </Select>
        </FieldWrapper>

        <FieldWrapper label="Geboortedatum" htmlFor="birth_date">
          <Input
            id="birth_date"
            name="birth_date"
            type="date"
            max={new Date().toISOString().slice(0, 10)}
            defaultValue={data.birth_date ?? ""}
          />
        </FieldWrapper>

        <FieldWrapper label="Status" htmlFor="status">
          <Select id="status" name="status" defaultValue={data.status}>
            <option value="active">Actief</option>
            <option value="deceased">Overleden</option>
            <option value="sold">Verkocht</option>
            <option value="given_away">Weggegeven</option>
          </Select>
        </FieldWrapper>
      </div>

      <fieldset className="rounded-2xl border border-line-soft p-4">
        <legend className="px-1 font-mono text-xs font-bold uppercase tracking-wider text-ink-faint">
          Ringgegevens
        </legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <FieldWrapper label="Ringnummer" htmlFor="ring_number">
            <Input
              id="ring_number"
              name="ring_number"
              defaultValue={data.ring_number ?? ""}
            />
          </FieldWrapper>
          <FieldWrapper label="Jaar" htmlFor="ring_year">
            <Input
              id="ring_year"
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
            htmlFor="ring_color"
            hint={
              suggestedColor && !overridden
                ? `Voorgestelde kleur op basis van jaar: ${suggestedColor}`
                : undefined
            }
          >
            <div className="relative">
              {getRingColorSwatch(effectiveColor) && (
                <span
                  className="absolute left-3 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full border border-black/15"
                  style={{ backgroundColor: getRingColorSwatch(effectiveColor)! }}
                />
              )}
              <Input
                id="ring_color"
                name="ring_color"
                value={effectiveColor}
                onChange={(e) => {
                  setRingColor(e.target.value);
                  setOverridden(true);
                }}
                placeholder={suggestedColor ?? "bv. groen"}
                className={getRingColorSwatch(effectiveColor) ? "pl-8" : undefined}
              />
            </div>
          </FieldWrapper>
          <FieldWrapper label="Verenigingscode" htmlFor="ring_federation_code">
            <Input
              id="ring_federation_code"
              name="ring_federation_code"
              defaultValue={data.ring_federation_code ?? ""}
              placeholder="bv. NBvV"
            />
          </FieldWrapper>
        </div>
        <input
          type="hidden"
          name="ring_color_overridden"
          value={overridden ? "on" : ""}
        />
        {suggestedColor && (
          <label className="mt-2 flex cursor-pointer items-center gap-2 py-1 text-xs text-ink-soft">
            <input
              type="checkbox"
              checked={overridden}
              onChange={(e) => setOverridden(e.target.checked)}
              className="h-4 w-4 cursor-pointer accent-moss"
            />
            Kleur handmatig aangepast (wijkt af van de automatische suggestie)
          </label>
        )}
      </fieldset>

      <fieldset className="rounded-2xl border border-line-soft p-4">
        <legend className="px-1 font-mono text-xs font-bold uppercase tracking-wider text-ink-faint">
          Afstamming
        </legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <FieldWrapper label="Vader" htmlFor="father_id">
            <Select id="father_id" name="father_id" defaultValue={data.father_id ?? ""}>
              <option value="">Onbekend</option>
              {fatherCandidates.map((b) => (
                <option key={b.id} value={b.id}>
                  {formatBirdLabel(b)}
                </option>
              ))}
            </Select>
          </FieldWrapper>
          <FieldWrapper label="Moeder" htmlFor="mother_id">
            <Select id="mother_id" name="mother_id" defaultValue={data.mother_id ?? ""}>
              <option value="">Onbekend</option>
              {motherCandidates.map((b) => (
                <option key={b.id} value={b.id}>
                  {formatBirdLabel(b)}
                </option>
              ))}
            </Select>
          </FieldWrapper>
        </div>
      </fieldset>

      <FieldWrapper
        label="Foto (optioneel)"
        htmlFor="photo"
        hint={currentPhotoUrl ? "Kies een nieuw bestand om de huidige foto te vervangen." : undefined}
      >
        {currentPhotoUrl && (
          <Image
            src={currentPhotoUrl}
            alt=""
            width={56}
            height={56}
            unoptimized
            className="mb-2 h-14 w-14 rounded-full object-cover"
          />
        )}
        <Input id="photo" name="photo" type="file" accept="image/*" />
      </FieldWrapper>

      <FieldWrapper label="Notities" htmlFor="notes">
        <Textarea id="notes" name="notes" rows={3} defaultValue={data.notes ?? ""} />
      </FieldWrapper>

      <div className="flex justify-end gap-3">
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}
