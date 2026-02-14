"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What makes fitByte protein bars unique?",
    answer:
      "Our bars are engineered in the lab to provide the perfect balance of premium protein, zero added sugar, and high-impact flavor. We use bio-available ingredients to ensure you're getting the best fuel for your ambition.",
  },
  {
    question: "Are fitByte products suitable for vegans?",
    answer:
      "We offer a range of products including plant-based options. Check the product details or 'Expression Tags' for the 'Vegan' label on each item.",
  },
  {
    question: "How should I store my fitByte products?",
    answer:
      "For peak freshness and texture, store your bars and snacks in a cool, dry place. While not required, some customers prefer them slightly chilled for an extra snap!",
  },
  {
    question: "Where do you ship fitByte products?",
    answer:
      "We currently offer pan-India shipping. Delivery times typically range from 2-5 business days depending on your location.",
  },
  {
    question: "Are these bars meal replacements?",
    answer:
      "fitByte bars are designed as high-quality protein supplements or bridge-meals. While they are packed with nutrients, we recommend enjoying them as part of a balanced, whole-food diet.",
  },
];

export function FaqSection() {
  return (
    <section className="py-24 bg-[#faf7f2] relative overflow-hidden">
      {/* Decorative Background Text */}
      <div className="absolute top-0 right-0 left-0 bottom-0 pointer-events-none overflow-hidden select-none">
        <span className="absolute -top-10 -right-20 text-[20rem] font-black text-stone-200/40 tracking-tighter uppercase leading-none italic">
          FAQ
        </span>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 space-y-4"
          >
            <h2 className="text-4xl md:text-6xl font-black text-[#1a2b47] tracking-tighter uppercase italic leading-none">
              Questions? <br />
              <span className="text-[#e31e24] underline decoration-stone-200 underline-offset-8">
                We Got Answers.
              </span>
            </h2>
            <p className="text-stone-500 font-medium text-lg max-w-2xl mx-auto uppercase tracking-widest leading-relaxed">
              Everything you need to know about the future of performance
              snacking.
            </p>
          </motion.div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <AccordionItem
                  value={`item-${index}`}
                  className="bg-white border-2 border-stone-200 rounded-2xl px-6 md:px-8 py-2 overflow-hidden hover:border-[#1a2b47] transition-colors group"
                >
                  <AccordionTrigger className="text-xl md:text-2xl font-black text-[#1a2b47] tracking-tighter uppercase italic text-left hover:no-underline hover:text-[#e31e24] py-6">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-stone-600 text-lg font-medium leading-relaxed pb-8">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
