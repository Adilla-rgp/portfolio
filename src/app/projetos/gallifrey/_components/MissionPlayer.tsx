"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Segmented } from "@/components/ui/Segmented";
import { Tag } from "@/components/ui/Tag";
import { Accent } from "@/components/ui/Typography/Accent";
import { Heading } from "@/components/ui/Typography/Heading";
import { Text, textVariants } from "@/components/ui/Typography/Text";
import {
  gallifreyCase,
  type MissionQuestion,
  type MissionView,
} from "@/content/cases/gallifrey";
import { cn } from "@/lib/cn";
import { countCorrect, missionLog, type MissionAttempt } from "@/lib/gallifreyMission";

const copy = gallifreyCase.mission;

interface MissionPlayerProps {
  questions: readonly MissionQuestion[];
  /** Case page that explains the product decisions; null hides the link. */
  whyHref: string | null;
}

type OptionState = "idle" | "correct" | "wrong" | "faded";

const optionVariant = {
  idle: "outline",
  correct: "ok",
  wrong: "signal",
  faded: "outline",
} as const;

function optionState(question: MissionQuestion, option: number, picked: number | undefined): OptionState {
  if (picked === undefined) return "idle";
  if (option === question.correct) return "correct";
  if (option === picked) return "wrong";
  return "faded";
}

export function MissionPlayer({ questions, whyHref }: MissionPlayerProps) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [attempts, setAttempts] = useState<MissionAttempt[]>([]);
  const [view, setView] = useState<MissionView>("aluno");
  const promptRef = useRef<HTMLHeadingElement>(null);
  const resultRef = useRef<HTMLParagraphElement>(null);
  const shouldFocusRef = useRef(false);

  const total = questions.length;
  const isFinished = questionIndex >= total;
  const question = questions[Math.min(questionIndex, total - 1)];
  const picked = attempts.find((attempt) => attempt.questionIndex === questionIndex)?.picked;
  const isAnswered = picked !== undefined;
  const isCorrect = picked === question.correct;
  const score = countCorrect(questions, attempts);
  const isSystemView = view === "sistema";

  // Moves focus to the new question (or the result) after "Próxima", so
  // keyboard and screen reader users land on what just appeared.
  useEffect(() => {
    if (!shouldFocusRef.current) return;
    shouldFocusRef.current = false;
    (isFinished ? resultRef.current : promptRef.current)?.focus();
  }, [questionIndex, isFinished]);

  const pick = (option: number) => {
    if (isAnswered) return;
    setAttempts([...attempts, { questionIndex, picked: option }]);
  };

  const next = () => {
    shouldFocusRef.current = true;
    setQuestionIndex(questionIndex + 1);
  };

  const restart = () => {
    shouldFocusRef.current = true;
    setAttempts([]);
    setQuestionIndex(0);
  };

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <Tag tone="lit">{copy.planet}</Tag>
          <Text as="span" size="label" tone="muted">
            {isFinished ? copy.done : copy.progress(questionIndex + 1, total)}
          </Text>
        </div>
        <Segmented
          aria-label={copy.viewLabel}
          options={copy.views}
          value={view}
          onValueChange={setView}
        />
      </div>

      <ol aria-hidden="true" className="flex gap-1.5">
        {questions.map((item, index) => {
          const attempt = attempts.find((candidate) => candidate.questionIndex === index);
          const isDone = attempt !== undefined && index < questionIndex;
          return (
            <li
              key={item.prompt}
              className={cn(
                "h-1.5 flex-1 rounded-chip transition-colors duration-300",
                isDone && (attempt.picked === item.correct ? "bg-ok" : "bg-signal"),
                !isDone && (index === questionIndex ? "bg-fg" : "bg-line"),
              )}
            />
          );
        })}
      </ol>

      <div className="flex flex-wrap items-stretch gap-5">
        <Card className="flex min-w-0 grow-3 basis-130 flex-col gap-6 md:p-8">
          {isFinished ? (
            <div className="flex animate-pop flex-col items-start gap-5 py-6">
              <Text as="span" size="label" tone="muted">
                {copy.finished}
              </Text>
              <Heading
                as="p"
                size="displayXl"
                ref={resultRef}
                tabIndex={-1}
                aria-label={copy.scoreLabel(score, total)}
              >
                <Accent>{score}</Accent>/{total}
              </Heading>
              <Text size="lg" className="max-w-120">
                {score === total ? copy.finalText.perfect : copy.finalText.partial}
              </Text>
              <Button size="lg" onClick={restart}>
                {copy.restart}
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Text as="span" size="label" tone="muted">
                  {copy.questionLabel(questionIndex + 1, total)}
                </Text>
                {isSystemView && (
                  <Tag tone="signal" className="animate-pop font-bold">
                    {copy.bloomBadge(question.bloom)}
                  </Tag>
                )}
              </div>
              <Heading as="h2" size="node" ref={promptRef} tabIndex={-1}>
                {question.prompt}
              </Heading>
              <pre
                className={cn(
                  textVariants({ size: "code", tone: "fg" }),
                  "overflow-x-auto rounded-item border border-line bg-bg px-5.5 py-5",
                )}
              >
                {question.code}
              </pre>
              <div className="grid gap-2.5 sm:grid-cols-2">
                {question.options.map((option, index) => {
                  const state = optionState(question, index, picked);
                  return (
                    <Button
                      key={option}
                      variant={optionVariant[state]}
                      aria-disabled={isAnswered}
                      aria-pressed={picked === index}
                      onClick={() => pick(index)}
                      className={cn(
                        "min-h-16 justify-start gap-3.5 rounded-item px-4.5 text-left normal-case",
                        isAnswered && "cursor-default",
                        state === "faded" && "border-line text-faint hover:border-line hover:text-faint",
                      )}
                    >
                      <span className="font-normal opacity-70">{copy.optionLetters[index]}</span>
                      <Text as="span" size="code" tone="inherit" className="font-bold">
                        {option}
                      </Text>
                    </Button>
                  );
                })}
              </div>
              <div aria-live="polite">
                {isAnswered && (
                  <Card
                    variant={isCorrect ? "ok" : "signal"}
                    radius="item"
                    padding="sm"
                    className="flex animate-pop flex-wrap items-center justify-between gap-4"
                  >
                    <span className="flex max-w-140 flex-col gap-1">
                      <Heading as="span" size="node" tone="inherit" className="uppercase">
                        {isCorrect ? copy.feedback.correct : copy.feedback.wrong}
                      </Heading>
                      <Text as="span" tone="inherit">
                        {question.explanation}
                      </Text>
                    </span>
                    <Button variant="dark" onClick={next}>
                      {questionIndex === total - 1 ? copy.finish : copy.next}
                    </Button>
                  </Card>
                )}
              </div>
            </div>
          )}
        </Card>

        <Card
          className={cn(
            "flex min-w-0 grow-2 basis-80 flex-col gap-4 transition-colors duration-300",
            isSystemView && "border-signal bg-bg",
          )}
        >
          {isSystemView ? (
            <div className="flex animate-pop flex-col gap-4">
              <Text as="span" size="label" tone="signal">
                {copy.system.title}
              </Text>
              <pre
                className={cn(
                  textVariants({ size: "code", tone: "fg" }),
                  "whitespace-pre-wrap wrap-anywhere",
                )}
              >
                {missionLog(questions, copy.topic, attempts)}
              </pre>
              <Text as="span" size="codeXs" tone="muted">
                {copy.system.note}
              </Text>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <Text as="span" size="label" tone="muted">
                {copy.product.title}
              </Text>
              <ul className="flex flex-col gap-3.5">
                {copy.product.items.map((item) => (
                  <Text as="li" key={item} tone="fg">
                    <Accent aria-hidden="true">→</Accent> {item}
                  </Text>
                ))}
              </ul>
              {whyHref && (
                <Link
                  href={whyHref}
                  className={cn(textVariants({ size: "monoLg", tone: "signal" }), "font-bold")}
                >
                  {copy.product.why}
                </Link>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
