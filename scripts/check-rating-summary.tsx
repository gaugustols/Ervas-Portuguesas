import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { renderToStaticMarkup } from "react-dom/server";
import { formatScore, getRatingSummaryMotion, RatingSummary } from "../components/ui/rating-summary";
import { defaults, schema } from "../video/rating-summary/rating-summary.schema";

assert.deepEqual(schema.parse(defaults), defaults);
assert.equal(defaults.count, defaults.snippets.length, "Count refers to the displayed excerpts");
assert.equal(formatScore(defaults.score), "4,9");
assert.equal(getRatingSummaryMotion(0, 4.9, 3).score, 0);
assert.equal(getRatingSummaryMotion(42, 4.9, 3).score, 4.9);
assert.equal(getRatingSummaryMotion(46, 4.9, 3).stars, 4.9);
assert.ok(getRatingSummaryMotion(78, 4.9, 3).snippets.every(item => item.opacity === 1 && item.x === 0));
assert.deepEqual(getRatingSummaryMotion(149, 4.9, 3), getRatingSummaryMotion(78, 4.9, 3));
const markup = renderToStaticMarkup(<RatingSummary {...defaults} />);
const photos = [...markup.matchAll(/<img\b[^>]*>/g)].map(match => match[0]);
assert.equal(photos.length, 2, "Only the supplied Regina and Edite photos are rendered");
assert.match(photos[0], /src="assets\/nova-pagina\/images\/regina-celia-vallejo\.jpg"/);
assert.match(photos[1], /src="assets\/nova-pagina\/images\/edite-souza\.jpg"/);
for (const photo of photos) {
  assert.match(photo, /alt=""/);
  assert.match(photo, /width="40" height="40" loading="lazy" decoding="async"/);
}
for (const file of ["regina-celia-vallejo.jpg", "edite-souza.jpg"]) {
  assert.ok(readFileSync(new URL(`../assets/nova-pagina/images/${file}`, import.meta.url)).length > 0);
}
const withoutPhotos = renderToStaticMarkup(<RatingSummary {...defaults} snippets={defaults.snippets.map(({ avatar, ...snippet }) => snippet)} />);
assert.ok(!/<img\b/.test(withoutPhotos), "Testimonials without a supplied photo render without placeholders");
assert.ok(markup.includes('aria-label="Avaliação de 4,9 em 5"'));
assert.ok(markup.includes('data-rating-star="90"'), "Fractional last star is preserved");
const reduced = renderToStaticMarkup(<RatingSummary {...defaults} frame={0} reducedMotion />);
assert.ok(!reduced.includes("opacity:0"));
const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
assert.ok(html.includes(markup));

const runtime = readFileSync(new URL("../assets/nova-pagina/js/rating-summary.js", import.meta.url), "utf8");
function runtimeScenario(reducedMotion: boolean, observerAvailable = true) {
  const preference = { matches: reducedMotion };
  const score = { dataset: { ratingScore: "4.9" }, textContent: "4,9" };
  const count = { dataset: { ratingCount: "3" }, textContent: "3" };
  const stars = [100, 100, 100, 100, 90].map(fill => ({ dataset: { ratingStar: String(fill) }, style: { width: fill + "%" } }));
  const classes = new Set<string>();
  const root = {
    dataset: {} as Record<string, string>,
    classList: { add: (value: string) => classes.add(value), remove: (value: string) => classes.delete(value) },
    querySelector: (selector: string) => selector.includes("score") ? score : count,
    querySelectorAll: () => stars,
  };
  const frames: Array<(time: number) => void> = [];
  let enter: ((entries: unknown[]) => void) | undefined;
  class Observer {
    constructor(callback: (entries: unknown[]) => void) { enter = callback; }
    observe() {}
    unobserve() {}
  }
  const window = { matchMedia: () => preference, ...(observerAvailable ? { IntersectionObserver: Observer } : {}) };
  runInNewContext(runtime, {
    window, document: { querySelectorAll: () => [root] }, IntersectionObserver: Observer,
    performance: { now: () => 0 }, requestAnimationFrame: (callback: (time: number) => void) => frames.push(callback), Intl,
  });
  return { score, count, stars, classes, frames, enter: () => enter?.([{ isIntersecting: true, target: root }]), preference };
}
const normal = runtimeScenario(false);
assert.equal(normal.score.textContent, "4,9", "Off-screen content keeps its final accessible value");
normal.enter();
assert.equal(normal.score.textContent, "0,0");
normal.frames.shift()!(1400);
assert.equal(normal.score.textContent, "4,9");
normal.frames.shift()!(2600);
assert.equal(normal.count.textContent, "3");
assert.equal(normal.stars[4].style.width, "90%");
assert.ok(!normal.classes.has("rating-summary--playing"));
normal.enter();
assert.equal(normal.frames.length, 0, "Animation only runs once");
for (const fallback of [runtimeScenario(true), runtimeScenario(false, false)]) {
  fallback.enter();
  assert.equal(fallback.score.textContent, "4,9");
  assert.equal(fallback.frames.length, 0);
}
const changedPreference = runtimeScenario(false);
changedPreference.enter();
changedPreference.preference.matches = true;
changedPreference.frames.shift()!(500);
assert.equal(changedPreference.score.textContent, "4,9");
assert.ok(!changedPreference.classes.has("rating-summary--playing"));
console.log("Rating schema, frame timing, fractional stars, static content and runtime accessibility fallbacks passed.");
