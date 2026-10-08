import type { Metadata } from "next";
import { IBM_Plex_Mono, Manrope } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { SmoothScroll } from "@/components/smooth-scroll";
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
    <html lang="en" suppressHydrationWarning>
      <body className={`${manrope.variable} ${plexMono.variable} font-sans antialiased`}>
        <ThemeProvider><SmoothScroll />{children}</ThemeProvider>
      </body>
    </html>
  );
}
