import { describe, expect, it } from "vitest";
import { missionQuestions } from "@/content/cases/gallifrey";
import { countCorrect, missionLog } from "@/lib/gallifreyMission";

describe("missionLog", () => {
  it("logs the mission start before any answer", () => {
    const log = JSON.parse(missionLog(missionQuestions, "listas", []));
    expect(log).toMatchObject({ evento: "missao_iniciada", questoes: missionQuestions.length });
    expect(log.niveis_bloom).toEqual(missionQuestions.map((question) => question.bloom));
  });

  it("logs the latest attempt with its Bloom level and the running score", () => {
    const [first, second] = missionQuestions;
    const attempts = [
      { questionIndex: 0, picked: first.correct },
      { questionIndex: 1, picked: (second.correct + 1) % second.options.length },
    ];
    const log = JSON.parse(missionLog(missionQuestions, "listas", attempts));
    expect(log).toMatchObject({
      evento: "tentativa",
      questao: 2,
      bloom: second.bloom,
      correta: false,
      sequencia_acertos: 1,
    });
  });
});

describe("countCorrect", () => {
  it("counts only correct answers", () => {
    const attempts = missionQuestions.map((question, questionIndex) => ({
      questionIndex,
      picked: question.correct,
    }));
    expect(countCorrect(missionQuestions, attempts)).toBe(missionQuestions.length);
    expect(countCorrect(missionQuestions, [])).toBe(0);
  });
});
