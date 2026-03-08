
"use client";

import Image from "next/image";
import { useState } from "react";

const testimonials = [
  {
    quote:
      "After enrolling in Meta Verified, I noticed increased reach on my posts and higher engagement with my audience. I think that seeing a verified badge builds trust. People that I don’t know or newer brands interested in working with me can make sure that they’re talking with me and not a scammer.",
    name: "Kristen Greenwood",
    title: "Owner of Water Bear Photography",
  },
  {
    quote:
      "Since subscribing, I've noticed a real difference. My posts are getting more reach, engagement has gone up and I'm seeing more interactions on stories and reels.",
    name: "Devon Kirby",
    title: "Owner, Mom Approved Miami",
  },
  {
    quote:
      "Having a verified account signals to both our existing followers and new visitors that we are a credible, professional business that takes both our products and social presence seriously.",
    name: "Sarah Clancy",
    title: "Owner of Sarah Marie Running Co.",
  },
];

export function TestimonialSection() {
  const [index, setIndex] = useState(0);
  const current = testimonials[index];

  const next = () => setIndex((prev) => (prev + 1) % testimonials.length);
  const prev = () => setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="mx-auto mt-16 flex max-w-4xl flex-col items-center gap-6 px-4 text-center sm:px-6">
      <Image src="/ic_quote.svg" alt="Quote" width={40} height={40} />
      <blockquote className="text-xl font-medium text-slate-800 transition-all duration-300">
        “{current.quote}”
      </blockquote>
      <p className="text-sm font-semibold text-slate-500">
        {current.name}, {current.title}
      </p>
      <div className="flex items-center gap-4">
        <button
          onClick={prev}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-200"
          aria-label="Previous testimonial"
        >
          ‹
        </button>
        <div className="flex items-center gap-2">
          {testimonials.map((_, i) => (
            <span
              key={i}
              className={`h-2 w-2 rounded-full transition ${i === index ? "bg-metaBlue" : "bg-slate-300"}`}
            />
          ))}
        </div>
        <button
          onClick={next}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-200"
          aria-label="Next testimonial"
        >
          ›
        </button>
      </div>
    </section>
  );
}
