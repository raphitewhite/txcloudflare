"use client";

import { useState } from "react";

const faqs = [
  {
    question: "How do I know if my business is eligible?",
    answer:
      "Meta Verified is available in selected regions for businesses that meet content eligibility requirements for Facebook and Instagram, as outlined in Meta’s policies.",
  },
  {
    question: "How can I stay informed if I'm not yet eligible?",
    answer:
      "Join the waitlist and we’ll notify you as soon as Meta Verified for Business becomes available in your country or industry.",
  },
  {
    question: "I already have a verified badge. What happens to it?",
    answer:
      "Legacy verified badges will remain, but Meta Verified unlocks additional protection, support, and profile enhancements tailored to businesses.",
  },
  {
    question: "What if I am interested in Meta Verified for creators?",
    answer:
      "Visit the Meta Verified for creators help center to explore offerings and pricing specific to creators.",
  },
  {
    question: "When will my badge appear?",
    answer:
      "Once your documentation is reviewed, your badge will appear on the selected profiles automatically. We’ll send status updates via email.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);
  return (
    <section className="mx-auto mt-20 max-w-4xl px-4 sm:px-6">
      <h2 className="text-3xl font-semibold text-slate-900">FAQ</h2>
      <p className="mt-2 text-sm text-slate-500">
        For more, visit our Help Center (Instagram and Facebook).
      </p>
      <div className="mt-6 divide-y divide-slate-200 rounded-3xl border border-slate-200 bg-white">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <button
              key={faq.question}
              className="w-full px-6 py-5 text-left"
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
            >
              <div className="flex items-center justify-between">
                <span className="text-base font-semibold text-slate-900">{faq.question}</span>
                <span className="text-2xl font-semibold text-slate-400">{isOpen ? "−" : "+"}</span>
              </div>
              {isOpen ? <p className="mt-3 text-sm text-slate-600">{faq.answer}</p> : null}
            </button>
          );
        })}
      </div>
    </section>
  );
}
