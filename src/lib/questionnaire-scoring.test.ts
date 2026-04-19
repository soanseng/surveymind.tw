import { describe, expect, it } from "vitest";
import { computeQuestionnaireScore } from "./questionnaire-scoring";

describe("computeQuestionnaireScore", () => {
  it("sums numeric answers and ignores nil answers", () => {
    expect(computeQuestionnaireScore(["0", "1", "nil", "3", null, ""])).toBe(4);
  });
});
