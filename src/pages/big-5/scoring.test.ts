import { describe, expect, it } from "vitest";
import { BIG_FIVE_DIMENSIONS, computeBigFiveScore } from "./scoring";

describe("computeBigFiveScore", () => {
  it("sums answers into the expected five dimensions", () => {
    const answers = Array(44).fill("1");

    BIG_FIVE_DIMENSIONS.extraversion.forEach((index) => {
      answers[index] = "5";
    });
    BIG_FIVE_DIMENSIONS.agreeableness.forEach((index) => {
      answers[index] = "4";
    });
    BIG_FIVE_DIMENSIONS.conscientiousness.forEach((index) => {
      answers[index] = "3";
    });
    BIG_FIVE_DIMENSIONS.neuroticism.forEach((index) => {
      answers[index] = "2";
    });

    expect(computeBigFiveScore(answers)).toEqual({
      extraversion: 40,
      agreeableness: 36,
      conscientiousness: 27,
      neuroticism: 16,
      openness: 10,
    });
  });
});
