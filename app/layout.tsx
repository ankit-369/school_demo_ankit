import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { BackToGuidePill } from "@/components/layout/back-to-guide-pill";
import { SchoolTitleSync } from "@/components/layout/school-title-sync";
import { Toaster } from "@/components/ui/sonner";
import { StoreHydrator } from "@/lib/store/store-hydrator";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "HealthConnect", template: "%s · HealthConnect" },
  description: "School health records, camps and screenings for administrators, nurses, teachers and doctors.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        {children}
        <StoreHydrator />
        <SchoolTitleSync />
        <BackToGuidePill />
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
