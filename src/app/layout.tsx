import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OnChain Roast - Get Your Solana Trading Roasted",
  description: "Analyze your Solana wallet trading history and get brutally roasted. Discover your degen score, earn badges, and share your results!",
  keywords: ["solana", "crypto", "trading", "roast", "degen", "memecoin", "wallet", "analysis"],
  openGraph: {
    title: "OnChain Roast",
    description: "Get your Solana trading history roasted. Find out how degen you really are!",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OnChain Roast",
    description: "Get your Solana trading history roasted. Find out how degen you really are!",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-900 text-white`}
      >
        {children}
      </body>
    </html>
  );
}
