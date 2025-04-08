"use client";

import { type ComponentProps } from "react";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";
import { Inter } from "next/font/google";
import AuthContext from "./contexts/AuthContext";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/toaster";
import { registerServiceWorker } from './sw-register';

const inter = Inter({ subsets: ["latin"] });

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
      <body className={inter.className}>
        <SessionProvider>
          <NextTopLoader showSpinner={false} color="#57BEBB" />
          <Toaster />
          
          <AuthContext>{children}</AuthContext>
        </SessionProvider>
      </body>
    </html>
  );
}
