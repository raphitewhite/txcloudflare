import { NextRequest, NextResponse } from "next/server";
import type { FormData, LocationData } from "@/types/form";

export async function POST(request: NextRequest) {
  try {
    const body: FormData = await request.json();

    // Lấy IP: Cloudflare Workers dùng cf-connecting-ip
    const cfIp = request.headers.get("cf-connecting-ip");
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = (cfIp ? cfIp.trim() : "") || (forwarded ? forwarded.split(",")[0] : "unknown");

    // Mock location detection (trong production dùng service thật)
    const location = {
      country: "United States",
      countryCode: body.countryCode || "US",
      city: "New York",
      region: "New York",
    };

    const meta: LocationData = {
      ip,
      location,
    };

    // Validate form data
    if (!body.fullName || !body.email || !body.phoneNumber) {
      return NextResponse.json(
        { success: false, message: "Missing required fields", meta },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Form submitted successfully",
      meta,
    });
  } catch (error) {
    console.error("Submit form error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
