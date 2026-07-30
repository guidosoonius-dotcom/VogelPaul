export function formatBirdLabel(bird: {
  name?: string | null;
  ring_number?: string | null;
  ring_year?: number | null;
}): string {
  if (bird.name) return bird.name;
  if (bird.ring_number) {
    return bird.ring_year
      ? `Ring ${bird.ring_number} (${bird.ring_year})`
      : `Ring ${bird.ring_number}`;
  }
  return "Naamloze vogel";
}

export function formatSex(sex: "male" | "female" | "unknown"): string {
  return { male: "Man", female: "Pop", unknown: "Onbekend" }[sex];
}

export function formatStatus(
  status: "active" | "deceased" | "sold" | "given_away",
): string {
  return {
    active: "Actief",
    deceased: "Overleden",
    sold: "Verkocht",
    given_away: "Weggegeven",
  }[status];
}
