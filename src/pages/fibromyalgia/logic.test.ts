import { describe, expect, it } from "vitest";
import { computeScore, WPI_BODY_MAP_HOTSPOTS, WPI_PARTS } from "./logic";

describe("computeScore", () => {
  it("meets diagnostic and NHI criteria at the documented 7/5 threshold", () => {
    const result = computeScore(
      [true, true, true, true, true, true, false, false, false, false, true, false, false, true, false, false, true, false, false],
      [2, 2, 1],
      [0, 0, 0],
      true,
      6,
    );

    expect(result.wpi).toBe(9);
    expect(result.sss).toBe(5);
    expect(result.generalizedPain).toBe(true);
    expect(result.meetsDx).toBe(true);
    expect(result.meetsNhi).toBe(true);
  });

  it("meets diagnostic criteria at the documented 4-6 / 9 threshold", () => {
    const result = computeScore(
      [true, false, false, false, false, true, false, false, false, false, true, false, false, true, false, false, false, false, false],
      [3, 3, 1],
      [1, 1, 0],
      true,
      5,
    );

    expect(result.wpi).toBe(4);
    expect(result.sss).toBe(9);
    expect(result.meetsDx).toBe(true);
    expect(result.meetsNhi).toBe(false);
  });

  it("fails when generalized pain is not present", () => {
    const result = computeScore(
      [true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
      [3, 3, 3],
      [1, 1, 1],
      true,
      8,
    );

    expect(result.wpiSssMet).toBe(true);
    expect(result.generalizedPain).toBe(false);
    expect(result.meetsDx).toBe(false);
    expect(result.failedCriteria).toContain("泛發性疼痛 (≥4/5 區)");
  });

  it("covers every WPI body part exactly once in the SVG body map", () => {
    const indices = WPI_BODY_MAP_HOTSPOTS.map((spot) => spot.partIndex).sort(
      (a, b) => a - b,
    );

    expect(indices).toEqual(WPI_PARTS.map((_, index) => index));
  });
});
