import { faqConfig } from "../lib/faq-config";

const root = document.getElementById("faq-root");
const buttons = Array.from(root?.querySelectorAll<HTMLButtonElement>(".faq-trigger") ?? []);

// Keep SSR design and accessible controls without React/Radix/Motion in the browser.
for (const [index, button] of buttons.entries()) {
  const panel = button.closest(".faq-item")?.querySelector<HTMLElement>(".faq-content");
  if (!panel || !faqConfig.data[index]) continue;
  button.setAttribute("aria-controls", panel.id);
  if (!panel.querySelector(".faq-answer")) {
    const answer = document.createElement("div");
    answer.className = "faq-answer";
    for (const part of faqConfig.data[index].answer.split(/(Botica Viva)/gi)) {
      if (/^Botica Viva$/i.test(part)) {
        const brand = document.createElement("span");
        brand.className = "landing-brand-name";
        brand.textContent = part;
        answer.append(brand);
      } else answer.append(document.createTextNode(part));
    }
    panel.append(answer);
  }
  button.addEventListener("click", () => {
    const opening = button.getAttribute("aria-expanded") !== "true";
    for (const current of buttons) {
      const item = current.closest(".faq-item");
      const content = item?.querySelector<HTMLElement>(".faq-content");
      if (!content) continue;
      const open = current === button && opening;
      const state = open ? "open" : "closed";
      current.setAttribute("aria-expanded", String(open));
      for (const element of [item, current.parentElement, current, content]) {
        if (element instanceof HTMLElement) element.dataset.state = state;
      }
      content.hidden = !open;
      if (open) content.style.setProperty("--radix-accordion-content-height", `${content.scrollHeight}px`);
    }
  });
  button.addEventListener("keydown", event => {
    const moves: Record<string, number> = { ArrowDown: (index + 1) % buttons.length, ArrowUp: (index - 1 + buttons.length) % buttons.length, Home: 0, End: buttons.length - 1 };
    if (!(event.key in moves)) return;
    event.preventDefault();
    buttons[moves[event.key]].focus();
  });
}
