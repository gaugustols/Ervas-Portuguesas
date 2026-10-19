import { createRevealManager } from "../lib/scroll-reveal";
import { landingRevealTargets } from "../lib/landing-reveals";

// Layout is not wrapped: mobile display:contents and existing grid spans remain intact.
const targets = landingRevealTargets();
const manager = createRevealManager();
document.querySelectorAll<HTMLElement>(".hook-question-enter, .historia .split, .sistema .split").forEach(element => {
  element.style.animation = "none";
});
for (const [element, options] of targets) manager.observe(element, options);

// Translated elements must not introduce horizontal scrolling while pending.
document.documentElement.style.overflowX = "clip";

if (window.matchMedia("print").matches) manager.disconnect();
window.addEventListener("beforeprint", () => manager.disconnect());
