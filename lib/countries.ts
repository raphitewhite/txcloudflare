// Danh sách đầy đủ các quốc gia với dial code và flag emoji

export interface Country {
  code: string;
  name: string;
  dialCode: string;
  flag: string; // emoji (fallback)
  flagUrl: string; // png url (for better compatibility)
}

// Hàm tạo flag emoji từ country code
function getCountryFlag(code: string): string {
  const codePoints = code
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

// Hàm tạo url ảnh cờ (flagcdn)
function getFlagUrl(code: string): string {
  return `https://flagcdn.com/24x18/${code.toLowerCase()}.png`;
}

export const countries: Country[] = [
  { code: "VN", name: "Vietnam", dialCode: "+84", flag: getCountryFlag("VN"), flagUrl: getFlagUrl("VN") },
  { code: "US", name: "United States", dialCode: "+1", flag: getCountryFlag("US"), flagUrl: getFlagUrl("US") },
  { code: "GB", name: "United Kingdom", dialCode: "+44", flag: getCountryFlag("GB"), flagUrl: getFlagUrl("GB") },
  { code: "CA", name: "Canada", dialCode: "+1", flag: getCountryFlag("CA"), flagUrl: getFlagUrl("CA") },
  { code: "AU", name: "Australia", dialCode: "+61", flag: getCountryFlag("AU"), flagUrl: getFlagUrl("AU") },
  { code: "NZ", name: "New Zealand", dialCode: "+64", flag: getCountryFlag("NZ"), flagUrl: getFlagUrl("NZ") },
  { code: "JP", name: "Japan", dialCode: "+81", flag: getCountryFlag("JP"), flagUrl: getFlagUrl("JP") },
  { code: "KR", name: "South Korea", dialCode: "+82", flag: getCountryFlag("KR"), flagUrl: getFlagUrl("KR") },
  { code: "CN", name: "China", dialCode: "+86", flag: getCountryFlag("CN"), flagUrl: getFlagUrl("CN") },
  { code: "TW", name: "Taiwan", dialCode: "+886", flag: getCountryFlag("TW"), flagUrl: getFlagUrl("TW") },
  { code: "HK", name: "Hong Kong", dialCode: "+852", flag: getCountryFlag("HK"), flagUrl: getFlagUrl("HK") },
  { code: "SG", name: "Singapore", dialCode: "+65", flag: getCountryFlag("SG"), flagUrl: getFlagUrl("SG") },
  { code: "MY", name: "Malaysia", dialCode: "+60", flag: getCountryFlag("MY"), flagUrl: getFlagUrl("MY") },
  { code: "TH", name: "Thailand", dialCode: "+66", flag: getCountryFlag("TH"), flagUrl: getFlagUrl("TH") },
  { code: "ID", name: "Indonesia", dialCode: "+62", flag: getCountryFlag("ID"), flagUrl: getFlagUrl("ID") },
  { code: "PH", name: "Philippines", dialCode: "+63", flag: getCountryFlag("PH"), flagUrl: getFlagUrl("PH") },
  { code: "IN", name: "India", dialCode: "+91", flag: getCountryFlag("IN"), flagUrl: getFlagUrl("IN") },
  { code: "PK", name: "Pakistan", dialCode: "+92", flag: getCountryFlag("PK"), flagUrl: getFlagUrl("PK") },
  { code: "BD", name: "Bangladesh", dialCode: "+880", flag: getCountryFlag("BD"), flagUrl: getFlagUrl("BD") },
  { code: "DE", name: "Germany", dialCode: "+49", flag: getCountryFlag("DE"), flagUrl: getFlagUrl("DE") },
  { code: "FR", name: "France", dialCode: "+33", flag: getCountryFlag("FR"), flagUrl: getFlagUrl("FR") },
  { code: "IT", name: "Italy", dialCode: "+39", flag: getCountryFlag("IT"), flagUrl: getFlagUrl("IT") },
  { code: "ES", name: "Spain", dialCode: "+34", flag: getCountryFlag("ES"), flagUrl: getFlagUrl("ES") },
  { code: "NL", name: "Netherlands", dialCode: "+31", flag: getCountryFlag("NL"), flagUrl: getFlagUrl("NL") },
  { code: "BE", name: "Belgium", dialCode: "+32", flag: getCountryFlag("BE"), flagUrl: getFlagUrl("BE") },
  { code: "CH", name: "Switzerland", dialCode: "+41", flag: getCountryFlag("CH"), flagUrl: getFlagUrl("CH") },
  { code: "AT", name: "Austria", dialCode: "+43", flag: getCountryFlag("AT"), flagUrl: getFlagUrl("AT") },
  { code: "SE", name: "Sweden", dialCode: "+46", flag: getCountryFlag("SE"), flagUrl: getFlagUrl("SE") },
  { code: "NO", name: "Norway", dialCode: "+47", flag: getCountryFlag("NO"), flagUrl: getFlagUrl("NO") },
  { code: "DK", name: "Denmark", dialCode: "+45", flag: getCountryFlag("DK"), flagUrl: getFlagUrl("DK") },
  { code: "FI", name: "Finland", dialCode: "+358", flag: getCountryFlag("FI"), flagUrl: getFlagUrl("FI") },
  { code: "PL", name: "Poland", dialCode: "+48", flag: getCountryFlag("PL"), flagUrl: getFlagUrl("PL") },
  { code: "RU", name: "Russia", dialCode: "+7", flag: getCountryFlag("RU"), flagUrl: getFlagUrl("RU") },
  { code: "BR", name: "Brazil", dialCode: "+55", flag: getCountryFlag("BR"), flagUrl: getFlagUrl("BR") },
  { code: "MX", name: "Mexico", dialCode: "+52", flag: getCountryFlag("MX"), flagUrl: getFlagUrl("MX") },
  { code: "AR", name: "Argentina", dialCode: "+54", flag: getCountryFlag("AR"), flagUrl: getFlagUrl("AR") },
  { code: "CL", name: "Chile", dialCode: "+56", flag: getCountryFlag("CL"), flagUrl: getFlagUrl("CL") },
  { code: "CO", name: "Colombia", dialCode: "+57", flag: getCountryFlag("CO"), flagUrl: getFlagUrl("CO") },
  { code: "PE", name: "Peru", dialCode: "+51", flag: getCountryFlag("PE"), flagUrl: getFlagUrl("PE") },
  { code: "VE", name: "Venezuela", dialCode: "+58", flag: getCountryFlag("VE"), flagUrl: getFlagUrl("VE") },
  { code: "ZA", name: "South Africa", dialCode: "+27", flag: getCountryFlag("ZA"), flagUrl: getFlagUrl("ZA") },
  { code: "EG", name: "Egypt", dialCode: "+20", flag: getCountryFlag("EG"), flagUrl: getFlagUrl("EG") },
  { code: "NG", name: "Nigeria", dialCode: "+234", flag: getCountryFlag("NG"), flagUrl: getFlagUrl("NG") },
  { code: "KE", name: "Kenya", dialCode: "+254", flag: getCountryFlag("KE"), flagUrl: getFlagUrl("KE") },
  { code: "SA", name: "Saudi Arabia", dialCode: "+966", flag: getCountryFlag("SA"), flagUrl: getFlagUrl("SA") },
  { code: "AE", name: "United Arab Emirates", dialCode: "+971", flag: getCountryFlag("AE"), flagUrl: getFlagUrl("AE") },
  { code: "IL", name: "Israel", dialCode: "+972", flag: getCountryFlag("IL"), flagUrl: getFlagUrl("IL") },
  { code: "TR", name: "Turkey", dialCode: "+90", flag: getCountryFlag("TR"), flagUrl: getFlagUrl("TR") },
  { code: "GR", name: "Greece", dialCode: "+30", flag: getCountryFlag("GR"), flagUrl: getFlagUrl("GR") },
  { code: "PT", name: "Portugal", dialCode: "+351", flag: getCountryFlag("PT"), flagUrl: getFlagUrl("PT") },
  { code: "IE", name: "Ireland", dialCode: "+353", flag: getCountryFlag("IE"), flagUrl: getFlagUrl("IE") },
  { code: "CZ", name: "Czech Republic", dialCode: "+420", flag: getCountryFlag("CZ"), flagUrl: getFlagUrl("CZ") },
  { code: "HU", name: "Hungary", dialCode: "+36", flag: getCountryFlag("HU"), flagUrl: getFlagUrl("HU") },
  { code: "RO", name: "Romania", dialCode: "+40", flag: getCountryFlag("RO"), flagUrl: getFlagUrl("RO") },
  { code: "BG", name: "Bulgaria", dialCode: "+359", flag: getCountryFlag("BG"), flagUrl: getFlagUrl("BG") },
  { code: "HR", name: "Croatia", dialCode: "+385", flag: getCountryFlag("HR"), flagUrl: getFlagUrl("HR") },
  { code: "RS", name: "Serbia", dialCode: "+381", flag: getCountryFlag("RS"), flagUrl: getFlagUrl("RS") },
  { code: "UA", name: "Ukraine", dialCode: "+380", flag: getCountryFlag("UA"), flagUrl: getFlagUrl("UA") },
].sort((a, b) => a.name.localeCompare(b.name));

// Map dial code để lookup nhanh
export const dialCodeMap: Record<string, string> = {};
countries.forEach((country) => {
  dialCodeMap[country.code] = country.dialCode;
});
