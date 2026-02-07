import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000"
  ),
  title: "my4cut",
  description: "나만의 네컷 포토부스",
  icons: {
    icon: "/images/logo_main.svg",
  },
  openGraph: {
    title: "my4cut",
    description: "나만의 네컷 포토부스",
    images: [
      {
        url: "/images/thumbnail.png",
        width: 600,
        height: 600,
        alt: "my4cut 로고",
      },
    ],
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
