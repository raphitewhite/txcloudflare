import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import DevToolBlocker from "@/components/DevToolBlocker";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Accounts Center | Meta Verified",
  description:
    "Manage connected experiences in an Accounts Center inspired by Meta. Built with Next.js 14, TypeScript, and Tailwind CSS.",
  metadataBase: new URL("https://accounts-center-clone.example.com"),
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  openGraph: {
    title: "Accounts Center | Meta Verified",
    description:
      "Manage connected experiences in an Accounts Center inspired by Meta.",
    url: "https://accounts-center-clone.example.com/accounts-center",
    siteName: "Accounts Center Clone",
    images: [
      {
        url: "/verified-badge.jpg",
        width: 1200,
        height: 630,
        alt: "Accounts Center preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Accounts Center | Meta Verified",
    description:
      "Manage connected experiences in an Accounts Center inspired by Meta.",
    images: ["/verified-badge.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 text-slate-900`}
      >
        <DevToolBlocker />
        {children}
      </body>
    </html>
  );
}
