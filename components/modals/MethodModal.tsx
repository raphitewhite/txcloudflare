"use client";

import { useState } from "react";
import Image from "next/image";
import type { VerificationMethod } from "@/types/form";
import { maskPhone, maskEmail } from "@/lib/utils";

interface MethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (method: VerificationMethod) => void;
  phone: string;
  email: string;
  dialCode: string;
}

const methods: Array<{
  value: VerificationMethod;
  label: string;
  icon?: string; // emoji fallback
  iconPath?: string; // for brand logos
}> = [
  { value: "app", label: "Authenticator app", icon: "📱" },
  { value: "sms", label: "SMS", icon: "💬" },
  { value: "email", label: "Email", icon: "📧" },
  { value: "whatsapp", label: "WhatsApp", iconPath: "/ic_whatsapp.svg" },
];

export function MethodModal({
  isOpen,
  onClose,
  onSubmit,
  phone,
  email,
  dialCode,
}: MethodModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<VerificationMethod | null>(null);

  const handleSubmit = () => {
    if (selectedMethod) {
      onSubmit(selectedMethod);
    }
  };

  const getSubtitle = (method: VerificationMethod): string => {
    switch (method) {
      case "sms":
      case "whatsapp":
        return maskPhone(phone, dialCode);
      case "email":
        return maskEmail(email);
      case "app":
        return "Confirm through your authenticator app";
      default:
        return "";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          aria-label="Close"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-6">
          <div className="mb-4 text-center">
            <h2 className="text-lg font-semibold text-slate-900">
              Choose a way to confirm that it&apos;s you
            </h2>
            <p className="mt-2 text-xs text-slate-500">
              We&apos;ll send a code to your selected method.
            </p>
          </div>

          <div className="space-y-3">
            {methods.map((method) => (
              <label
                key={method.value}
                className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition ${
                  selectedMethod === method.value
                    ? "border-metaBlue bg-metaBlue/5"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <input
                  type="radio"
                  name="method"
                  value={method.value}
                  checked={selectedMethod === method.value}
                  onChange={() => setSelectedMethod(method.value)}
                  className="h-4 w-4 text-metaBlue"
                />
                {method.iconPath ? (
                  <Image
                    src={method.iconPath}
                    alt={method.label}
                    width={24}
                    height={24}
                    className="h-6 w-6"
                  />
                ) : (
                  <span className="text-2xl">{method.icon}</span>
                )}
                <div className="flex-1">
                  <p className="font-medium text-slate-900">{method.label}</p>
                  <p className="text-xs text-slate-500">{getSubtitle(method.value)}</p>
                </div>
              </label>
            ))}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={!selectedMethod}
              className="w-full rounded-lg bg-metaBlue px-6 py-3 font-semibold text-white transition hover:bg-metaIndigo disabled:opacity-50"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
