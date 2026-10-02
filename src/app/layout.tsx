import type { Metadata, Viewport } from "next";
import "./globals.css";
import BackToTop from "@/components/BackToTop";
import BootSequence from "@/components/BootSequence";
import CursorField from "@/components/CursorField";
import MagneticTilt from "@/components/MagneticTilt";
import ScrollProgress from "@/components/ScrollProgress";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import WorldScene from "@/components/WorldScene";

export const metadata: Metadata = {
  title: {
    default: "Mridul Singh Saklani — AI/ML & Software Engineer",
    template: "%s — Mridul Singh Saklani",
  },
  description:
    "The portfolio of Mridul Singh Saklani, a Software and AI/ML Engineer building scalable software, intelligent applications, and cloud systems.",
};

export const viewport: Viewport = {
  themeColor: "#07090b",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Manrope:wght@300;400;500;600;700;800&display=swap"
        />
      </head>
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <BootSequence />
        <CursorField />
        <MagneticTilt />
        <WorldScene />
        <div className="ambient-glow" aria-hidden="true" />
        <div className="ambient-grid" aria-hidden="true" />
        <ScrollProgress />
        <div className="content-shell" id="top">
          <SiteHeader />
          {children}
          <SiteFooter />
        </div>
        <BackToTop />
      </body>
    </html>
  );
}
