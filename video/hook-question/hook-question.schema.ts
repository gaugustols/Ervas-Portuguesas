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

// Oferta digital: descrever apenas a entrega disponível no web app.
export const defaults: HookQuestionInput = schema.parse({
  question: "Conhece as ervas e organiza a tua botica com mais confiança.",
  answer: "A Botica Viva é uma ferramenta digital de consulta de plantas e preparações caseiras: encontra utilizações tradicionais, instruções de preparação e cuidados, num só lugar.",
  colors: {
    text: "#ffffff",
    primary: "#0b6b2c",
    background: "#000000",
  },
  fonts: { heading: "'Plus Jakarta Sans', system-ui, sans-serif" },
});
