export function computeQuestionnaireScore(answers: Array<string | null>) {
  return answers.reduce((acc, current) => {
    return acc + (current !== null && current !== "" && current !== "nil" ? Number.parseInt(current, 10) : 0);
  }, 0);
}
