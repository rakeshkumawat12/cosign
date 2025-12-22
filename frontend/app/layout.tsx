import type { Metadata } from "next";
import "./globals.css";
import { WalletProvider } from "@/lib/wallet-context";
import { Syne, JetBrains_Mono } from "next/font/google";

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-syne",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CoSign - Multi-Signature Wallet",
  description: "Secure multi-signature wallet for Ethereum. Require multiple approvals before executing transactions.",
  keywords: ["multisig", "multi-signature", "ethereum", "wallet", "web3", "crypto", "security"],
  authors: [{ name: "CoSign Team" }],
  openGraph: {
    title: "CoSign - Multi-Signature Wallet",
    description: "Protect your crypto with shared control. Require multiple approvals before any transaction is executed.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${syne.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased font-sans" suppressHydrationWarning>
        <WalletProvider>
          {children}
        </WalletProvider>
      </body>
    </html>
  );
}
