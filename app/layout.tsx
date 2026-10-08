import type { Metadata } from "next";
import { Suspense } from "react";
import { IBM_Plex_Mono, Manrope } from "next/font/google";
import { NavigationFeedback } from "@/components/navigation-feedback";
import "./globals.css";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], variable: "--font-plex-mono", weight: ["400", "500", "600"], display: "swap" });

export const metadata: Metadata = {
  title: "Trading Journal",
  description: "R-multiple trading journal and discipline dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body className={`${manrope.variable} ${plexMono.variable} font-sans antialiased`}>
        <script dangerouslySetInnerHTML={{ __html: `try{var t=localStorage.getItem('trading-journal-theme')||localStorage.getItem('trading-journal-auth-theme');document.documentElement.dataset.theme=t==='light'?'light':'dark'}catch(e){}` }} />
        <Suspense fallback={null}><NavigationFeedback /></Suspense>{children}
      </body>
    </html>
  );
}
