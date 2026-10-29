// Built with Remotion - https://remotion.pro/license
import type { CSSProperties } from "react";
import { BrandNameText } from "./brand-name-text";
import { Star } from "lucide-react";
import { defineVideoMeta } from "../../kit/spec";
import type { RatingSummaryInput } from "../../video/rating-summary/rating-summary.schema";

export const meta = defineVideoMeta({
  spec: "21st.video/1",
  kind: "scene",
  category: "testimonial/rating",
  tags: ["testimonial", "rating", "stars", "reviews", "social proof", "score", "count up"],
  engines: { remotion: ">=4.0.479 <5" },
  timing: {
    fps: 30,
    duration: { default: 150, min: 75, max: 600 },
    stretch: "hold",
    phases: { in: 78, out: 0 },
    markers: { settled: 78, stars: 46 },
    beats: [4, 12, 46, 50, 58, 66],
  },
  layout: { aspects: ["16:9", "9:16", "1:1"], mode: "responsive", fill: "frame", safeArea: "title", transparent: true, backdrop: ["background"] },
  slots: [
    { key: "score", type: "text", maxChars: 4, lines: 1, role: "stat" },
    { key: "count", type: "number", role: "value" },
    { key: "countLabel", type: "text", maxChars: 24, lines: 1, role: "label" },
    { key: "source", type: "text", maxChars: 40, lines: 2, role: "kicker" },
    { key: "snippets", type: "list", role: "quote" },
  ],
  brand: { color: "colors.text", accent: "colors.primary", surfaceColor: "colors.background", background: "colors.background", fontFamily: "fonts.heading", bodyFontFamily: "fonts.body", numeralsFontFamily: "fonts.numerals" },
  motionBeats: [
    { target: "score", prop: "value", from: "0", settledBy: 42, easing: "ease" },
    { target: "stars", prop: "fill", from: "0", settledBy: 46, easing: "ease" },
    { target: "snippets", prop: "x", from: "right", settledBy: 78, easing: "spring" },
  ],
  render: { deterministic: true, clientRenderable: true, webgl: false, requiresGpu: false },
  preview: { poster: { marker: "settled" }, hover: [0, 150] },
  provenance: { origin: "own", license: "MIT", sourceUrl: "21st first-party (rating summary with review snippets, 2026-10-06)" },
});

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const ease = (value: number) => value * value * (3 - 2 * value);
export const formatScore = (score: number) => new Intl.NumberFormat("pt-PT", { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(score);

export function getRatingSummaryMotion(frame: number, score: number, count: number) {
  const progress = ease(clamp(frame / 42));
  return {
    score: score * progress,
    count: Math.round(count * progress),
    stars: score * ease(clamp((frame - 12) / 34)),
    snippets: [50, 58, 66].map(start => {
      const t = clamp((frame - start) / (78 - start));
      const spring = t === 1 ? 1 : 1 - Math.exp(-7 * t) * Math.cos(10 * t);
      return { opacity: clamp(t * 4), x: 36 * (1 - spring) };
    }),
  };
}

export type RatingSummaryProps = RatingSummaryInput & { frame?: number; reducedMotion?: boolean };

export function RatingSummary({ score, count, countLabel, source, snippets, colors, fonts, frame, reducedMotion = false }: RatingSummaryProps) {
  const controlled = frame !== undefined || reducedMotion;
  const state = getRatingSummaryMotion(reducedMotion ? 78 : (frame ?? 78), score, count);
  const style = {
    "--rating-text": colors.text,
    "--rating-accent": colors.primary,
    "--rating-background": colors.background,
    color: colors.text,
    fontFamily: fonts.body,
  } as CSSProperties;

  return (
    <div className="rating-summary hq:grid hq:min-w-0" style={style} data-rating-summary={controlled ? undefined : ""}>
      <div className="rating-summary-overview">
        <div className="rating-summary-score" role="img" aria-label={`Avaliação de ${formatScore(score)} em 5`} style={{ fontFamily: fonts.numerals }}>
          <span aria-hidden="true" data-rating-score={score}>{formatScore(state.score)}</span>
          <span className="rating-summary-scale" aria-hidden="true">/5</span>
        </div>
        <div className="rating-summary-stars" aria-hidden="true">
          {Array.from({ length: 5 }, (_, index) => {
            const final = Math.round(clamp(score - index) * 10000) / 100;
            return (
              <span className="rating-summary-star" key={index}>
                <Star className="rating-summary-star-outline" />
                <span className="rating-summary-star-fill" data-rating-star={final} style={{ width: `${Math.round(clamp(state.stars - index) * 10000) / 100}%` }}><Star fill="currentColor" /></span>
              </span>
            );
          })}
        </div>
        <p className="rating-summary-count" role="group" aria-label={`${count} ${countLabel}`}>
          <strong aria-hidden="true" data-rating-count={count} style={{ fontFamily: fonts.numerals }}>{state.count}</strong>
          <span aria-hidden="true">{countLabel}</span>
        </p>
        <p className="rating-summary-source">{source}</p>
      </div>
      <div className="rating-summary-snippets hq:grid hq:min-w-0" aria-label="Comentários selecionados">
        {snippets.map((snippet, index) => {
          const motion = state.snippets[index];
          const snippetStyle = {
            "--rating-delay": `${(50 + index * 8) / 30}s`,
            "--rating-duration": `${(78 - 50 - index * 8) / 30}s`,
            ...(controlled ? { opacity: motion.opacity, transform: `translateX(${motion.x}px)`, animation: "none" } : {}),
          } as CSSProperties;
          return (
            <figure className="rating-summary-snippet" key={snippet.author + index} style={snippetStyle}>
              <figcaption className="rating-summary-card-heading" style={{ fontFamily: fonts.heading }}>
                <span className="rating-summary-person">
                  {snippet.avatar && <img className="rating-summary-avatar" src={snippet.avatar} alt="" width="40" height="40" loading="lazy" decoding="async" />}
                  <span className="rating-summary-author">{snippet.author}</span>
                </span>
                <span className="rating-summary-card-stars" role="img" aria-label={`Classificação geral de ${formatScore(score)} em 5`} title={`Classificação geral: ${formatScore(score)}/5`}>
                  {Array.from({ length: 5 }, (_, star) => (
                    <Star key={star} fill="currentColor" aria-hidden="true" style={{ clipPath: `inset(0 ${(1 - clamp(score - star)) * 100}% 0 0)` }} />
                  ))}
                </span>
              </figcaption>
              <blockquote>“<BrandNameText>{snippet.quote}</BrandNameText>”</blockquote>
            </figure>
          );
        })}
      </div>
    </div>
  );
}

export const Component = RatingSummary;
