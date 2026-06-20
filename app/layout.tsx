import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppDock } from "./AppDock";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Auria Weather — Beautiful forecasts",
  description:
    "A beautifully animated weather experience built with Next.js, Framer Motion and Iconify.",
};

export const viewport: Viewport = {
  themeColor: "#0b0a1f",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-screen">
        {/* Fundo base (páginas sem o WeatherBackground reativo) */}
        <div
          aria-hidden
          className="fixed inset-0 -z-20 bg-[radial-gradient(120%_120%_at_50%_0%,#1d1a44_0%,#0b0a1f_60%)]"
        />
        {children}
        <AppDock />
      </body>
    </html>
  );
}
