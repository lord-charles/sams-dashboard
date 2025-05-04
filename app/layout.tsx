"use client";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";
import { IBM_Plex_Sans } from "next/font/google";
import AuthContext from "./contexts/AuthContext";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/toaster";
import { registerServiceWorker } from './sw-register';

const ibmPlexSans = IBM_Plex_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"], display: "swap" });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (typeof window !== 'undefined') {
    registerServiceWorker();
  }

  return (
    <html lang="en">
      <body className={ibmPlexSans.className}>
        <SessionProvider>
          <NextTopLoader showSpinner={false} color="#57BEBB" />
          <Toaster />
          <AuthContext>{children}</AuthContext>
        </SessionProvider>
      </body>
    </html>
  );
}
