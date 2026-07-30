// Kanarie-ringkleurcyclus: een terugkerende rotatie van ringkleuren per
// geboortejaar, zoals gebruikelijk bij Nederlandse/Belgische
// kanariekwekersverenigingen (gesloten pootringen). De cyclus herhaalt
// zich elke `cycleLength` jaar (standaard 6), beginnend bij `startYear`
// (het jaar waarin de cyclus op de eerste kleur staat).
//
// Dit is bewust applicatielogica (geen database-computed column): zo kan
// de UI al tijdens het invullen van het geboortejaar een kleursuggestie
// tonen, voordat er iets is opgeslagen. De daadwerkelijk opgeslagen
// `ring_color` op een vogel is altijd de brontabel-waarheid — deze
// functie wordt alleen gebruikt om een suggestie te berekenen, nooit om
// een eerder opgeslagen kleur te herberekenen.

export const CANARY_RING_COLOR_CYCLE = [
  "groen",
  "paars",
  "bruin",
  "rood",
  "blauw",
  "zwart",
] as const;

export type CanaryRingColor = (typeof CANARY_RING_COLOR_CYCLE)[number];

export interface RingColorCycleConfig {
  cycleLength: number;
  startYear: number;
}

/**
 * Berekent de ringkleur voor een gegeven jaar op basis van een cyclische
 * rotatie. `startYear` correspondeert met index 0 in `colors`. Werkt ook
 * correct voor jaren vóór `startYear` (veilige modulo).
 */
export function computeRingColorForYear(
  year: number,
  colors: readonly string[],
  config: RingColorCycleConfig,
): string {
  const length = config.cycleLength;
  const offset = ((year - config.startYear) % length + length) % length;
  return colors[offset % colors.length];
}

export function computeCanaryRingColor(
  ringYear: number,
  config: RingColorCycleConfig,
): CanaryRingColor {
  return computeRingColorForYear(
    ringYear,
    CANARY_RING_COLOR_CYCLE,
    config,
  ) as CanaryRingColor;
}
