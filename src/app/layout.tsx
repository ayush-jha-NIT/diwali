import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const body = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Last Spark | A little Diwali magic",
  description: "An interactive Diwali surprise, made with a little extra magic.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "The Last Spark",
    description: "Someone left a little magic for you tonight.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#090b20",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={display.variable + " " + body.variable}>{children}</body>
    </html>
  );
}
