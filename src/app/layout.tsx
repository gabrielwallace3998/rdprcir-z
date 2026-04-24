import type { Metadata } from "next";
import { Orbitron, JetBrains_Mono, Michroma } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

const michroma = Michroma({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-michroma",
});

export const metadata: Metadata = {
  title: "The Specimen 01-A | Umbrella Corp",
  description: "Biohazard Containment Protocol - Subject ID: 2026-GL",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${orbitron.variable} ${jetbrains.variable} ${michroma.variable} antialiased`}
        suppressHydrationWarning
      >
        <div className="scanlines" />
        <div className="noise" />
        <div className="vignette" />
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
