// Utility functions cho form

// Dial code map được export từ countries.ts
export { dialCodeMap } from "./countries";

export function maskPhone(phone: string, dialCode: string): string {
  const number = phone.replace(dialCode, "").trim();
  if (number.length <= 4) return dialCode + " *** " + number.slice(-2);
  return dialCode + " *** " + number.slice(-2);
}

export function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return email;
  if (local.length <= 1) return local + "***@" + domain;
  return local[0] + "***@" + domain;
}

export function getCountryFlag(countryCode: string): string {
  // Emoji flag từ country code (ví dụ: VN -> 🇻🇳)
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}
