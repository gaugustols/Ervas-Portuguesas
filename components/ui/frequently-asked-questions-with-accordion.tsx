"use client";

import { motion, MotionConfig } from "motion/react";
import { cn } from "@/lib/utils";
import { BrandNameText } from "./brand-name-text";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/frequently-asked-questions-with-accordion-utils/accordion";

export interface FAQItem {
  question: string;
  answer: string;
}

interface FrequentlyAskedQuestionsProps {
  title?: string;
  description?: string;
  data?: FAQItem[];
  className?: string;
  supportEmail?: string;
}

export default function FrequentlyAskedQuestions({
  title = "Perguntas frequentes",
  description = "Respostas às dúvidas mais comuns sobre a Botica Viva.",
  data = [],
  className,
  supportEmail,
}: FrequentlyAskedQuestionsProps) {
  const email = supportEmail?.trim();
  const hasEmail = email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  return (
    <MotionConfig reducedMotion="user">
      <section id="perguntas-frequentes" className={cn("sec faq", className)} aria-labelledby="faq-title">
        <div className="faq-inner">
          <h2 id="faq-title" className="faq-title">
            {title.split(" ").map((word, index) => (
              <span key={`${word}-${index}`}>
                {index > 0 && " "}
                <motion.span
                  className="faq-word"
                  initial={false}
                  whileInView={{ opacity: [0.8, 1], y: [6, 0] }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08, ease: "easeInOut" }}
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </h2>
          <p className="faq-description">
            <BrandNameText>{description}</BrandNameText>
            {hasEmail && <> <a href={`mailto:${email}`}>{email}</a></>}
          </p>
          <Accordion type="single" collapsible defaultValue="item-0" className="faq-list">
            {data.map((item, index) => (
              <AccordionItem value={`item-${index}`} key={item.question}>
                <AccordionTrigger><BrandNameText>{item.question}</BrandNameText></AccordionTrigger>
                <AccordionContent><BrandNameText>{item.answer}</BrandNameText></AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </MotionConfig>
  );
}
