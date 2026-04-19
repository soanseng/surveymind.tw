export type BigFiveScore = {
  extraversion: number;
  agreeableness: number;
  conscientiousness: number;
  neuroticism: number;
  openness: number;
};

export const BIG_FIVE_DIMENSIONS = {
  extraversion: [0, 5, 10, 15, 20, 25, 30, 35],
  agreeableness: [1, 6, 11, 16, 21, 26, 31, 36, 41],
  conscientiousness: [2, 7, 12, 17, 22, 27, 32, 37, 42],
  neuroticism: [3, 8, 13, 18, 23, 28, 33, 38],
  openness: [4, 9, 14, 19, 24, 29, 34, 39, 40, 43],
} satisfies Record<keyof BigFiveScore, number[]>;

export function computeBigFiveScore(answers: (string | null)[]): BigFiveScore {
  const score: BigFiveScore = {
    extraversion: 0,
    agreeableness: 0,
    conscientiousness: 0,
    neuroticism: 0,
    openness: 0,
  };

  Object.entries(BIG_FIVE_DIMENSIONS).forEach(([dimension, indexes]) => {
    indexes.forEach((index) => {
      score[dimension as keyof BigFiveScore] += Number.parseInt(
        answers[index] || "0",
        10,
      );
    });
  });

  return score;
}
