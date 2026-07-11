"use client";

import { useState } from "react";
import { FAQ } from "@/lib/api";
import { ChevronDown } from "lucide-react";

interface FAQAccordionProps {
  faqs: FAQ[];
  title?: string;
}

export default function FAQAccordion({ faqs, title }: FAQAccordionProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleIndex = (index: number) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  if (!faqs || faqs.length === 0) return null;

  return (
    <div className="w-full">
      {title && (
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 font-serif section-title">
          {title}
        </h2>
      )}
      <div className="space-y-3.5 mt-4">
        {faqs.map((faq, index) => {
          const isOpen = activeIndex === index;
          return (
            <div
              key={index}
              className="border border-border-custom bg-bg-custom/50 rounded-xl overflow-hidden transition-colors duration-200"
            >
              <button
                onClick={() => toggleIndex(index)}
                className="w-full flex items-center justify-between text-left p-4 sm:p-5 font-medium text-gray-900 hover:text-sage transition-colors focus:outline-hidden"
                aria-expanded={isOpen}
              >
                <span className="font-serif text-sm sm:text-base pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  size={16}
                  className={`text-gray-400 group-hover:text-sage shrink-0 transition-transform duration-300 ${
                    isOpen ? "rotate-180 text-sage" : ""
                  }`}
                />
              </button>
              
              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="p-4 sm:p-5 pt-0 sm:pt-0 text-xs sm:text-sm text-gray-650 leading-relaxed border-t border-border-custom/50 mt-1">
                    {faq.answer}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
