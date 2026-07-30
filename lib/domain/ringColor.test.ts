import { describe, expect, it } from "vitest";
import { computeCanaryRingColor } from "./ringColor";

describe("computeCanaryRingColor", () => {
  const config = { cycleLength: 6, startYear: 2026 };

  it("geeft groen voor het ankerjaar", () => {
    expect(computeCanaryRingColor(2026, config)).toBe("groen");
  });

  it("volgt de cyclus voor de jaren erna", () => {
    expect(computeCanaryRingColor(2027, config)).toBe("paars");
    expect(computeCanaryRingColor(2028, config)).toBe("bruin");
    expect(computeCanaryRingColor(2029, config)).toBe("rood");
    expect(computeCanaryRingColor(2030, config)).toBe("blauw");
    expect(computeCanaryRingColor(2031, config)).toBe("zwart");
  });

  it("herhaalt na cycleLength jaar", () => {
    expect(computeCanaryRingColor(2032, config)).toBe("groen");
    expect(computeCanaryRingColor(2038, config)).toBe("groen");
  });

  it("werkt ook correct voor jaren vóór het ankerjaar", () => {
    expect(computeCanaryRingColor(2025, config)).toBe("zwart");
    expect(computeCanaryRingColor(2020, config)).toBe("groen");
  });
});
