export type RevealDirection = "up" | "down" | "left" | "right" | "none";

export interface ScrollRevealOptions {
  direction?: RevealDirection;
  delay?: number;
  duration?: number;
  distance?: string;
  once?: boolean;
  threshold?: number;
}

export const REVEAL_EASING = "cubic-bezier(0.25, 0.46, 0.45, 0.94)";
export const REVEAL_ROOT_MARGIN = "0px 0px -50px 0px";

export function initialRevealTransform(direction: RevealDirection = "up", distance = "40px") {
  switch (direction) {
    case "up": return `translate3d(0, ${distance}, 0)`;
    case "down": return `translate3d(0, calc(-1 * ${distance}), 0)`;
    case "left": return `translate3d(calc(-1 * ${distance}), 0, 0)`;
    case "right": return `translate3d(${distance}, 0, 0)`;
    case "none": return "none";
  }
}

type StyleKey = "opacity" | "transform" | "transition" | "willChange" | "animation" | "overflowAnchor";
const styleKeys: StyleKey[] = ["opacity", "transform", "transition", "willChange", "animation", "overflowAnchor"];

/** Shared native observers; no scroll listeners or animation dependencies. */
export function createRevealManager() {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const records = new Map<HTMLElement, {
    options: Required<ScrollRevealOptions>;
    original: Record<StyleKey, string>;
    shown: boolean;
    timer?: ReturnType<typeof setTimeout>;
    observer?: IntersectionObserver;
    show: (immediate?: boolean) => void;
    hide: () => void;
  }>();
  const observers = new Map<number, IntersectionObserver>();

  const observerFor = (threshold: number) => {
    let observer = observers.get(threshold);
    if (!observer) {
      observer = new IntersectionObserver(entries => {
        for (const entry of entries) {
          const record = records.get(entry.target as HTMLElement);
          if (!record) continue;
          if (entry.isIntersecting && entry.intersectionRatio >= record.options.threshold) record.show();
          else if (!entry.isIntersecting && !record.options.once) record.hide();
        }
      }, { rootMargin: REVEAL_ROOT_MARGIN, threshold });
      observers.set(threshold, observer);
    }
    return observer;
  };

  function observe(element: HTMLElement, input: ScrollRevealOptions = {}) {
    if (records.has(element)) return () => {};
    const options = {
      direction: input.direction ?? "up",
      delay: Math.max(0, input.delay ?? 0),
      duration: Math.max(0, input.duration ?? 700),
      distance: input.distance ?? "40px",
      once: input.once ?? true,
      threshold: Math.min(1, Math.max(0, input.threshold ?? 0.15)),
    };
    const original = Object.fromEntries(styleKeys.map(key => [key, element.style[key]])) as Record<StyleKey, string>;
    const record = {
      options, original, shown: false, timer: undefined as ReturnType<typeof setTimeout> | undefined,
      observer: undefined as IntersectionObserver | undefined,
      show: (_immediate = false) => {}, hide: () => {},
    };
    records.set(element, record);
    element.dataset.scrollReveal = options.direction;
    // Older CSS entry animations must not override the new inline transforms.
    element.style.animation = "none";

    const settle = () => {
      element.style.opacity = original.opacity;
      element.style.transform = original.transform;
      element.style.transition = original.transition;
      element.style.willChange = original.willChange;
      element.dataset.revealState = "complete";
    };
    record.show = (immediate = false) => {
      if (record.shown && !immediate) return;
      record.shown = true;
      clearTimeout(record.timer);
      if (immediate || reduced.matches) element.style.transition = "none";
      element.style.opacity = "1";
      element.style.transform = original.transform || "none";
      element.dataset.revealState = "visible";
      if (options.once) record.observer?.unobserve(element);
      if (immediate || reduced.matches) settle();
      else record.timer = setTimeout(settle, options.duration + options.delay + 40);
    };
    record.hide = () => {
      clearTimeout(record.timer);
      record.shown = false;
      element.style.transition = `opacity ${options.duration}ms ${REVEAL_EASING} ${options.delay}ms, transform ${options.duration}ms ${REVEAL_EASING} ${options.delay}ms`;
      element.style.willChange = "opacity, transform";
      element.style.opacity = "0";
      element.style.transform = initialRevealTransform(options.direction, options.distance);
      element.dataset.revealState = "pending";
    };

    if (reduced.matches || typeof window.IntersectionObserver !== "function") record.show(true);
    else {
      record.hide();
      record.observer = observerFor(options.threshold);
      record.observer.observe(element);
      // Layout transforms are inline, but must not expand horizontal scrolling.
      element.style.setProperty("overflow-anchor", "none");
      if (element.contains(document.activeElement)) record.show(true);
    }

    return () => {
      clearTimeout(record.timer);
      record.observer?.unobserve(element);
      for (const key of styleKeys) element.style[key] = original[key];
      delete element.dataset.scrollReveal;
      delete element.dataset.revealState;
      records.delete(element);
    };
  }

  const onMotionChange = () => {
    if (reduced.matches) for (const record of records.values()) record.show(true);
  };
  const onFocus = (event: FocusEvent) => {
    if (!(event.target instanceof Node)) return;
    for (const [element, record] of records) if (element.contains(event.target)) record.show(true);
  };
  reduced.addEventListener("change", onMotionChange);
  document.addEventListener("focusin", onFocus);

  return {
    observe,
    disconnect() {
      for (const observer of observers.values()) observer.disconnect();
      for (const [element, record] of records) {
        clearTimeout(record.timer);
        for (const key of styleKeys) element.style[key] = record.original[key];
        delete element.dataset.scrollReveal;
        delete element.dataset.revealState;
      }
      records.clear();
      observers.clear();
      reduced.removeEventListener("change", onMotionChange);
      document.removeEventListener("focusin", onFocus);
    },
  };
}
