import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fruit System",
  description: "\u6c34\u679c\u4ed3\u5e93\u7ba1\u7406\u7cfb\u7edf"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
