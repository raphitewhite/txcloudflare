import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const headers = request.headers;

    // Cloudflare tự inject cf-ipcountry và cf-connecting-ip vào mọi request
    const cfCountry = headers.get("cf-ipcountry");
    const cfIp = headers.get("cf-connecting-ip");

    // Fallback cho localhost dev
    const forwarded = headers.get("x-forwarded-for");
    const ip =
      (cfIp ? cfIp.trim() : "") ||
      (forwarded ? forwarded.split(",")[0].trim() : "") ||
      "unknown";

    const isLocalhost =
      !cfCountry ||
      cfCountry === "XX" ||
      ip === "127.0.0.1" ||
      ip === "::1" ||
      ip === "unknown";

    if (isLocalhost) {
      return NextResponse.json({ success: false, countryCode: "US", ip });
    }

    const countryCode = cfCountry;
    let country = "";
    try {
      country = new Intl.DisplayNames(["en"], { type: "region" }).of(countryCode) || countryCode;
    } catch {
      country = countryCode;
    }

    // Gọi ipinfo để lấy thêm city/region nếu có token
    const ipinfoToken = process.env.IPINFO_TOKEN;
    let city = "";
    let region = "";

    if (ipinfoToken) {
      try {
        const res = await fetch(`https://ipinfo.io/${ip}?token=${ipinfoToken}`);
        const data = await res.json();
        if (!data?.error) {
          city = data.city || "";
          region = data.region || "";
        }
      } catch {
        // bỏ qua, city/region không quan trọng bằng countryCode
      }
    }

    return NextResponse.json({ success: true, countryCode, ip, country, city, region });
  } catch (error) {
    console.error("Detect location error:", error);
    return NextResponse.json({ success: false, countryCode: "US", ip: "unknown" });
  }
}
