// Built with Remotion - https://remotion.pro/license
import type { CSSProperties } from "react";
import { defineVideoMeta } from "../../kit/spec";
import { cn } from "../../lib/utils";
import type { HookQuestionInput } from "../../video/hook-question/hook-question.schema";

export const meta = defineVideoMeta({
  spec: "21st.video/1",
  kind: "scene",
  category: "text/hook",
  tags: ["hook", "cold open", "question", "intro", "social", "text"],
  engines: { remotion: ">=4.0.479 <5" },
  timing: {
    fps: 30,
    duration: { default: 105, min: 45, max: 600 },
    stretch: "hold",
    phases: { in: 60, out: 0 },
    markers: { settled: 60, answer: 45 },
    beats: [7, 20, 45],
  },
  layout: { aspects: ["1:1", "9:16", "16:9"], mode: "responsive", fill: "frame", safeArea: "title", transparent: true, backdrop: ["background"] },
  slots: [
    { key: "question", type: "text", maxChars: 72, lines: 3, role: "headline" },
    { key: "answer", type: "text", maxChars: 60, lines: 2, role: "subline" },
  ],
  brand: { color: "colors.text", accent: "colors.primary", background: "colors.background", fontFamily: "fonts.heading" },
  motionBeats: [
    { target: "question", prop: "y", from: "below", settledBy: 20, easing: "ease" },
    { target: "answer", prop: "opacity", settledBy: 60, easing: "ease" },
  ],
  render: { deterministic: true, clientRenderable: true, webgl: false, requiresGpu: false },
  preview: { poster: { marker: "settled" }, hover: [0, 105] },
  provenance: { origin: "own", license: "MIT", sourceUrl: "motion recipe from research V04 (cold-open question on black); own copy" },
});

export type HookQuestionProps = HookQuestionInput & {
  /** Supplied by the Remotion wrapper; omit for one-shot CSS motion on the web. */
  frame?: number;
  reducedMotion?: boolean;
  className?: string;
};

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const ease = (value: number) => value * value * (3 - 2 * value);

export function getHookQuestionMotion(frame: number) {
  const question = ease(clamp(frame / 20));
  return {
    questionOpacity: question,
    questionY: 32 * (1 - question),
    answerOpacity: ease(clamp((frame - 45) / 15)),
  };
}

export function HookQuestion({ question, answer, note, colors, fonts, frame, reducedMotion = false, className }: HookQuestionProps) {
  const controlled = frame !== undefined || reducedMotion;
  const motion = getHookQuestionMotion(reducedMotion ? 60 : (frame ?? 60));
  const titleStyle: CSSProperties = { color: colors.text, fontFamily: fonts.heading };
  const questionStyle: CSSProperties | undefined = controlled ? {
    animation: "none",
    opacity: motion.questionOpacity,
    transform: `translateY(${motion.questionY}px)`,
  } : undefined;
  const answerStyle: CSSProperties = {
    color: colors.text,
    fontFamily: fonts.heading,
    ...(controlled ? { animation: "none", opacity: motion.answerOpacity } : {}),
  };

  return (
    <>
      <h1 className={cn("hook-question-title hq:relative hq:w-full hq:text-balance", className)} style={titleStyle}>
        <span className="hook-question-enter hq:block" style={questionStyle}>
          {question.split(/(\b(?:ervas?|plantas?)\b)/gi).map((part, index) =>
            /^(?:ervas?|plantas?)$/i.test(part) ? <span key={index} className="hook-question-accent" style={{ color: colors.primary }}>{part}</span> : part
          )}
        </span>
      </h1>
      <p className="sub-h1 hook-question-answer hq:w-full hq:text-balance" style={answerStyle}>
        {answer}
        {note && <small className="hook-question-note">{note}</small>}
      </p>
    </>
  );
}

export const Component = HookQuestion;
