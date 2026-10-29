import { z } from "zod";

export const schema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
  note: z.string().min(1).optional(),
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
  question: "Despesas na farmácia, medicamentos para dormir, analgésicos, problemas de pele… E se algumas das plantas com usos tradicionais no bem-estar estivessem no teu quintal (ou no teu frigorífico) e tu nem soubesses?",
  answer: "Descobre como identificar e preparar as plantas do dia a dia com a Botica Viva: receitas tradicionais, instruções de cultivo e cuidados, passo a passo, tudo num só lugar.",
  note: "⚠️ As empresas farmacêuticas não querem que saibas disto.",
  colors: {
    text: "#ffffff",
    primary: "#0b6b2c",
    background: "#000000",
  },
  fonts: { heading: "'Plus Jakarta Sans', system-ui, sans-serif" },
});
