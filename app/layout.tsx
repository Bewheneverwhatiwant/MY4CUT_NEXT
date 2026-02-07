import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "my4cut",
  description: "나만의 네컷 포토부스",
  icons: {
    icon: "/images/logo_main.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
