import type { Metadata } from "next";
import { Fraunces, Space_Grotesk, ZCOOL_QingKe_HuangYou } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  axes: ["SOFT"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const zcoolQingKe = ZCOOL_QingKe_HuangYou({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "个人作品集 | 视频创作",
    template: "%s | 个人作品集",
  },
  description: "个人视频创作作品展示 — director's cut",
  openGraph: {
    title: "个人作品集 | 视频创作",
    description: "个人视频创作作品展示 — director's cut",
    siteName: "个人作品集",
    type: "website",
    locale: "zh_CN",
  },
  twitter: {
    card: "summary_large_image",
    title: "个人作品集 | 视频创作",
    description: "个人视频创作作品展示 — director's cut",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className={`${fraunces.variable} ${spaceGrotesk.variable} ${zcoolQingKe.variable}`}>
      <body className="min-h-screen flex flex-col text-ink antialiased font-body bg-surface">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
