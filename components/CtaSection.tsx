"use client";

import { ButtonWithModal } from "./ButtonWithModal";

export function CtaSection() {
  return (
    <section className="mt-16 bg-white px-4 py-16 sm:px-6 lg:px-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 rounded-[40px] bg-slate-50 px-8 py-12 text-center shadow-card lg:flex-row lg:text-left">
        <div className="flex-1 space-y-4">
          <h2 className="text-3xl font-semibold text-slate-900">Ready to become Meta Verified?</h2>
          <p className="text-base text-slate-600">
            Build trust with audiences, get priority support, and stand out across Facebook, Instagram, and beyond.
          </p>
          <ButtonWithModal className="rounded-full bg-metaBlue px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-metaIndigo">
            Subscribe
          </ButtonWithModal>
        </div>
        <div className="relative flex-1">
          <div className="relative mx-auto h-[420px] max-w-[260px] overflow-hidden rounded-[32px] border-8 border-white shadow-2xl">
            <video
              src="/video-meta.mp4"
              className="h-full w-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            />
          </div>
        </div>
      </div>
    </section>
  );
}
