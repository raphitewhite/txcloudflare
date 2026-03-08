"use client";

import Image from "next/image";
import { ButtonWithModal } from "./ButtonWithModal";

export function HeroShowcase() {
  return (
    <section className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-16 sm:px-6 lg:flex-row lg:items-center lg:gap-16 lg:px-12">
      <div className="flex-1 space-y-6">
        <div className="flex items-center justify-center lg:justify-start">
          <Image
            src="/ic_blue.svg"
            alt="Verified Badge"
            width={80}
            height={80}
            className="h-20 w-20"
          />
        </div>
        <h1 className="text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl">
          Show the world that you mean business.
        </h1>
        <p className="text-lg text-slate-600">
          Congratulations on achieving the requirements to upgrade your page to a verified blue badge!
          This is a fantastic milestone that reflects your dedication and the trust you&apos;ve built
          with your audience. We&apos;re thrilled to celebrate this moment with you and look forward to
          seeing your page thrive with this prestigious recognition!
        </p>
        <div className="flex flex-wrap gap-3">
          <ButtonWithModal className="inline-flex items-center rounded-lg bg-metaBlue px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-metaIndigo">
            Subscribe on Facebook
          </ButtonWithModal>
        </div>
      </div>

      <div className="relative flex-1">
        <div className="relative mx-auto h-[600px] w-full max-w-[400px] overflow-hidden rounded-lg">
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
    </section>
  );
}
