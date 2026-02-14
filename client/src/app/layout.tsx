import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import StoreProvider from "./StoreProvider";
import { CallProvider } from "@/lib/CallContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Secure Node | Direct Secure Line",
  description: "A private and secure real-time communication platform.",
  icons: {
    icon: "/favicon.svg",
  },
};

import AuthGuard from "./components/AuthGuard";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StoreProvider>
          <CallProvider>
            <AuthGuard>
              {children}
            </AuthGuard>
          </CallProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
