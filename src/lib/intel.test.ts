import { describe, expect, it } from "vitest";
import { finalRating, parseDoi, weightedScore } from "./intel";

describe("intelligence rules", () => {
  it("never rates a claim Supported without real records", () => {
    expect(finalRating("Supported", 0)).toBe("Not enough evidence");
    expect(finalRating("Supported", 3)).toBe("Supported");
    expect(finalRating("Bogus", 3)).toBe("Not enough evidence");
  });
  it("weights trade-off scores by user priorities", () => {
    expect(weightedScore({ environmental: 90, economic: 30, social: 60 }, { environmental: 2, economic: 1, social: 1 })).toBe(68);
    expect(weightedScore({ environmental: 90, economic: 30, social: 60 }, { environmental: 0, economic: 0, social: 0 })).toBe(60);
  });
  it("extracts DOIs from links", () => {
    expect(parseDoi("https://doi.org/10.1038/s41586-020-2649-2.")).toBe("10.1038/s41586-020-2649-2");
    expect(parseDoi("no doi here")).toBeNull();
  });
});
