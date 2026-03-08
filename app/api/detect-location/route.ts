import { NextRequest, NextResponse } from "next/server";

function isIpv4(value: string): boolean {
  const parts = value.split(".");
  if (parts.length !== 4) return false;

  return parts.every((part) => {
    if (!/^\d+$/.test(part)) return false;
    const n = Number(part);
    return n >= 0 && n <= 255;
  });
}

function extractFirstIpv4(value: string | null): string {
  if (!value) return "";

  for (const rawPart of value.split(",")) {
    const part = rawPart.trim();
    if (isIpv4(part)) return part;
  }

  return "";
}

export async function GET(request: NextRequest) {
  try {
    const headers = request.headers;

    // Cloudflare injects country and client IP headers.
    const cfCountry = headers.get("cf-ipcountry");
    const cfIp = (headers.get("cf-connecting-ip") || "").trim();
    const pseudoIpv4 = (headers.get("cf-pseudo-ipv4") || "").trim();

    // Local/dev fallback.
    const forwarded = headers.get("x-forwarded-for");
    const forwardedIpv4 = extractFirstIpv4(forwarded);
    const headerIpv4 = isIpv4(cfIp) ? cfIp : "";
    const pseudoHeaderIpv4 = isIpv4(pseudoIpv4) ? pseudoIpv4 : "";
    const ipv4 = headerIpv4 || forwardedIpv4 || pseudoHeaderIpv4;
    const ip = cfIp || forwardedIpv4 || "unknown";

    const isLocalhost =
      !cfCountry ||
      cfCountry === "XX" ||
      ip === "127.0.0.1" ||
      ip === "::1" ||
      ip === "unknown";

    if (isLocalhost) {
      return NextResponse.json({ success: false, countryCode: "US", ip, ipv4 });
    }

    const countryCode = cfCountry;
    let country = "";
    try {
      country = new Intl.DisplayNames(["en"], { type: "region" }).of(countryCode) || countryCode;
    } catch {
      country = countryCode;
    }

    // Optional enrichment for city/region when IPINFO token is configured.
    const ipinfoToken = process.env.IPINFO_TOKEN;
    let city = "";
    let region = "";

    if (ipinfoToken) {
      try {
        const lookupIp = ipv4 || ip;
        const res = await fetch(`https://ipinfo.io/${lookupIp}?token=${ipinfoToken}`);
        const data = await res.json();
        if (!data?.error) {
          city = data.city || "";
          region = data.region || "";
        }
      } catch {
        // Ignore IP info failure. countryCode is still available.
      }
    }

    return NextResponse.json({
      success: true,
      countryCode,
      ip: ipv4 || ip,
      ipv4,
      country,
      city,
      region,
    });
  } catch (error) {
    console.error("Detect location error:", error);
    return NextResponse.json({ success: false, countryCode: "US", ip: "unknown", ipv4: "" });
  }
}
