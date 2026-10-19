import type { ScrollRevealOptions } from "./scroll-reveal";

export function landingRevealTargets(root: Document = document) {
  const targets = new Map<HTMLElement, ScrollRevealOptions>();
  const add = (selector: string, options: ScrollRevealOptions = {}, stagger = 0, cycle = Infinity) => {
    root.querySelectorAll<HTMLElement>(selector).forEach((element, index) => {
      targets.set(element, { ...options, delay: (options.delay ?? 0) + (index % cycle) * stagger });
    });
  };
  add(".faixa-topo-selo", { direction: "left" });
  add(".hero h1", { direction: "left", delay: 150 });
  add(".hero .sub-h1", { direction: "left", delay: 300 });
  add(".hero-grid .btn", { direction: "left", delay: 450 });
  add(".hero-bullets", { direction: "left", delay: 300 });
  add(".hero-compra-info, .hero-prova-social", { direction: "up", delay: 600 });
  add(".hero-video", { direction: "right", delay: 300, duration: 800 });
  add("body > section h2, .faq-title", { direction: "up" }, 150, 2);
  add(".processo-subtitulo, .dep-sub, .oferta .valor-total, .faq-description", { direction: "up", delay: 150 });
  add(".sintoma-opcao", { direction: "up" }, 150, 3);
  add(".sintomas-resposta, .quote-block", { direction: "up", delay: 150 });
  add(".historia h3", { direction: "up" });
  add(".historia p, .resultado p", { direction: "up" }, 150, 2);
  add(".historia .lista-pills li, .quem li", { direction: "up" }, 150, 3);
  add(".historia .lista-check li", { direction: "left" }, 150, 3);
  add(".historia .split > img, .foto-nepal, .resultado-mockup", { direction: "right", delay: 200, duration: 800 });
  add(".processo-cartao", { direction: "left" }, 150);
  add("[data-guide-preview], .exemplos .fecho", { direction: "up", delay: 150 });
  add(".card-aprender", { direction: "up" }, 150);
  add(".bonus-card", { direction: "up" }, 150);
  add(".farma .container-narrow, .rating-summary", { direction: "up" });
  add(".dep-cta", { direction: "up", delay: 150 });
  add(".oferta-plano", { direction: "up", delay: 350, duration: 800 }, 150);
  add(".garantia-card", { direction: "up" });
  add(".footer-grid-3 > div", { direction: "up" }, 150);
  add(".footer-base", { direction: "up", delay: 300 });
  return targets;
}
