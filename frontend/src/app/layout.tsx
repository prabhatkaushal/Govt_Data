import type { Metadata } from "next";
import "./globals.css";
import { AppLayout } from "@/components/layout/AppLayout";
import { ThemeProvider } from "@/components/ThemeProvider";

import { Outfit, Syne, Cormorant_Garamond, Lora } from "next/font/google";

const outfit = Outfit({ 
  subsets: ["latin"],
  variable: "--font-sans",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-display",
});

const cormorant = Cormorant_Garamond({
  weight: ['400', '600', '700'],
  subsets: ["latin"],
  variable: "--font-legal-display",
});

const lora = Lora({
  weight: ['400', '500', '700'],
  subsets: ["latin"],
  variable: "--font-legal-sans",
});

export const metadata: Metadata = {
  title: "SECURE-OPS | Government Portal",
  description: "Secure Digital Document Management System for Law Enforcement",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.variable} ${syne.variable} ${cormorant.variable} ${lora.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <AppLayout>{children}</AppLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
