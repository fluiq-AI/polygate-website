import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://polygate.getfluiq.com"),
  title: "polygate - One function. Any LLM provider.",
  description:
    "A tiny, dependency-light client that gives Anthropic, OpenAI, Gemini, and Moonshot one consistent request and response shape. Open source, MIT licensed, for Python and TypeScript.",
  openGraph: {
    title: "polygate - One function. Any LLM provider.",
    description:
      "A tiny open-source client that normalizes Anthropic, OpenAI, Gemini, and Moonshot behind one function. Python and TypeScript.",
    url: "https://polygate.getfluiq.com",
    siteName: "polygate",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "polygate - One function. Any LLM provider.",
    description:
      "A tiny open-source client that normalizes Anthropic, OpenAI, Gemini, and Moonshot behind one function.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`}>
      <body className="bg-white text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-100">
        {children}
      </body>
    </html>
  );
}
