import type { MissionQuestion } from "@/content/cases/gallifrey";

export interface MissionAttempt {
  questionIndex: number;
  picked: number;
}

/**
 * Event the back-end would log for the latest attempt, or the mission start
 * before any answer. Field names are illustrative (see the note on the page).
 */
export function missionLog(
  questions: readonly MissionQuestion[],
  topic: string,
  attempts: readonly MissionAttempt[],
): string {
  const last = attempts.at(-1);
  if (!last) {
    return JSON.stringify(
      {
        evento: "missao_iniciada",
        topico: topic,
        questoes: questions.length,
        niveis_bloom: questions.map((question) => question.bloom),
      },
      null,
      2,
    );
  }

  const question = questions[last.questionIndex];
  return JSON.stringify(
    {
      evento: "tentativa",
      topico: topic,
      questao: last.questionIndex + 1,
      bloom: question.bloom,
      resposta: question.options[last.picked],
      correta: last.picked === question.correct,
      sequencia_acertos: countCorrect(questions, attempts),
    },
    null,
    2,
  );
}

export function countCorrect(
  questions: readonly MissionQuestion[],
  attempts: readonly MissionAttempt[],
): number {
  return attempts.filter((attempt) => attempt.picked === questions[attempt.questionIndex].correct)
    .length;
}
