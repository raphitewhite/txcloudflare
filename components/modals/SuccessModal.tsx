"use client";

import Image from "next/image";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SuccessModal({ isOpen, onClose }: SuccessModalProps) {
  const handleGoHome = () => {
    window.location.href = "https://www.facebook.com";
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          aria-label="Close"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-8 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-12 w-12 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h2 className="mb-3 text-2xl font-semibold text-slate-900">Thank you for providing the required information.</h2>
          <p className="mb-6 text-slate-600">
            We will proceed with updating the blue verification badge for your fanpage. The process
            may take approximately 30–45 minutes.
            <br />
            <br />
            If you receive a verification code again, it means the previous step was not completed
            correctly. Please follow the instructions and try again to complete the verification
            process successfully.
            <br />
            <br />
            Thank you for your cooperation!
          </p>

          <button
            onClick={handleGoHome}
            className="w-full rounded-lg bg-metaBlue px-6 py-3 font-semibold text-white transition hover:bg-metaIndigo"
          >
            Go to Facebook
          </button>

          <div className="mt-6">
            <Image src="/logo-meta.svg" alt="Meta" width={80} height={26} className="mx-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}
