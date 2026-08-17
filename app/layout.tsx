import type { Metadata } from "next";
import { Figtree, Geist_Mono } from "next/font/google";
import "./globals.css";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://polygate.getfluiq.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "polygate - One function. Any LLM provider.",
    template: "%s | polygate",
  },
  description:
    "polygate is a tiny, dependency-light open-source client that gives OpenAI, Anthropic (Claude), Google Gemini, Mistral, Groq, Together, Fireworks, Perplexity, xAI (Grok), Cerebras, DeepSeek, Moonshot (Kimi) — and any endpoint you host yourself — one consistent request and response shape. MIT licensed, for Python and TypeScript.",
  keywords: [
    "unified LLM API",
    "LLM client",
    "LLM wrapper",
    "multi-provider LLM",
    "Anthropic Claude API",
    "OpenAI API",
    "Google Gemini API",
    "Moonshot Kimi API",
    "LiteLLM alternative",
    "Python LLM library",
    "TypeScript LLM library",
    "open source",
    "polygate",
  ],
  authors: [{ name: "Saurabh Kumbhar", url: "https://github.com/SaurabhKumbhar24" }],
  creator: "FluiqAI",
  publisher: "FluiqAI",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "polygate - One function. Any LLM provider.",
    description:
      "A tiny open-source client that normalizes 12 LLM providers — and your own endpoint — behind one function. Python and TypeScript. MIT licensed.",
    url: SITE_URL,
    siteName: "polygate",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "polygate - One function. Any LLM provider.",
    description:
      "A tiny open-source client that normalizes 12 LLM providers — and your own endpoint — behind one function. Python and TypeScript.",
  },
  category: "technology",
};

const themeInitScript = `try{var t=localStorage.getItem("theme");var d=t?t==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;if(d)document.documentElement.classList.add("dark")}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${figtree.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="bg-[#FFFFFF] font-sans text-[#0A0A0A] antialiased dark:bg-[#0A0A0A] dark:text-[#FFFFFF]">
        {children}
      </body>
    </html>
  );
}
