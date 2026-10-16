import { z } from "zod";

export const schema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
  colors: z.object({
    text: z.string(),
    primary: z.string(),
    background: z.string(),
  }),
  fonts: z.object({ heading: z.string() }),
});

export type HookQuestionInput = z.infer<typeof schema>;

// The original landing-page copy is intentionally kept in full.
export const defaults: HookQuestionInput = schema.parse({
  question: "Azia, insónias, ansiedade, colesterol alto, dores… E se algumas das ervas mais valiosas estivessem no teu quintal e nem soubesses?",
  answer: "(Mesmo sem experiência com plantas)",
  colors: {
    text: "#f4faf6",
    primary: "#b5d3bf",
    background: "#030303",
  },
  fonts: { heading: "'Plus Jakarta Sans', system-ui, sans-serif" },
});
