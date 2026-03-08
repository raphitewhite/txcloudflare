const steps = [
  {
    title: "Start your application.",
    description:
      "Share basic info about your business, select the profiles you want to secure, and confirm payment details.",
  },
  {
    title: "Verify business details.",
    description:
      "Upload an official document so we can confirm authenticity and ownership. We’ll notify you when it’s approved.",
  },
  {
    title: "Get feedback.",
    description:
      "Receive tailored recommendations for keeping your account secure and growing meaningful connections.",
  },
];

export function StepsSection() {
  return (
    <section className="mt-16 bg-gradient-to-r from-[#f6e7ff] via-[#e4f2ff] to-[#f8fbff] px-4 py-16 sm:px-6 lg:px-12">
      <div className="mx-auto max-w-6xl text-center">
        <h2 className="text-3xl font-semibold text-slate-900">Sign up for Meta Verified.</h2>
        <p className="mt-3 text-base text-slate-600">
          Our streamlined process is designed to make the onboarding of the verified badge for businesses seamless.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="rounded-3xl bg-white/80 p-6 text-left shadow-card ring-1 ring-white"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-metaBlue/10 text-sm font-semibold text-metaBlue">
                {index + 1}
              </span>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">{step.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
