import { hydrateRoot } from "react-dom/client";
import FrequentlyAskedQuestions from "../components/ui/frequently-asked-questions-with-accordion";
import { faqConfig } from "../lib/faq-config";

const root = document.getElementById("faq-root");
if (root) hydrateRoot(root, <FrequentlyAskedQuestions {...faqConfig} />, { identifierPrefix: "faq-" });
