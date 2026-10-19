"use client";

import { useLayoutEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { createRevealManager, type ScrollRevealOptions } from "../lib/scroll-reveal";

export interface ScrollRevealProps extends ScrollRevealOptions {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export default function ScrollReveal({
  children, direction = "up", delay = 0, duration = 700, distance = "40px",
  className, once = true, threshold = 0.15, style,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (!ref.current) return;
    const manager = createRevealManager();
    manager.observe(ref.current, { direction, delay, duration, distance, once, threshold });
    return () => manager.disconnect();
  }, [direction, delay, duration, distance, once, threshold]);

  // SSR remains readable without JavaScript; layout effect prepares opacity 0 before paint.
  return <div ref={ref} className={className} style={style}>{children}</div>;
}
