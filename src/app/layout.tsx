import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Women's Fitness Workout App UI",
  description: "Pixel-faithful fitness UI prototype rebuilt in Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
