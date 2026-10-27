import { z } from "zod";

export const schema = z.object({
  score: z.number().min(0).max(5),
  count: z.number().int().nonnegative(),
  countLabel: z.string().min(1).max(24),
  source: z.string().min(1).max(40),
  snippets: z.array(z.object({ quote: z.string().min(1), author: z.string().min(1), avatar: z.string().min(1).optional() })).min(1).max(3),
  colors: z.object({ text: z.string(), primary: z.string(), background: z.string() }),
  fonts: z.object({ heading: z.string(), body: z.string(), numerals: z.string() }),
});

export type RatingSummaryInput = z.infer<typeof schema>;

// Score supplied by the owner. Count describes the selected excerpts, not total reviews.
// App testimonials supplied by the owner; wording adapted to European Portuguese.
export const defaults: RatingSummaryInput = schema.parse({
  score: 4.9,
  count: 2,
  countLabel: "comentários em destaque",
  source: "Comentários sobre a aplicação",
  snippets: [
    { quote: "Estou a pôr em prática e a adorar. Recebi o acesso muito rapidamente. A Dalva é uma excelente profissional.", author: "Regina Celia Vallejo", avatar: "assets/nova-pagina/images/regina-celia-vallejo.jpg" },
    { quote: "Recebi tudo direitinho. Muito conhecimento e muito prático de usar.", author: "Edite Souza", avatar: "assets/nova-pagina/images/edite-souza.jpg" },
  ],
  colors: { text: "#111111", primary: "#ff9900", background: "#eceae6" },
  fonts: {
    heading: "Arial, Helvetica, sans-serif",
    body: "Arial, Helvetica, sans-serif",
    numerals: "Arial, Helvetica, sans-serif",
  },
});
