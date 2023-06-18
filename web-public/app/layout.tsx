import { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Retro Note - A place to journal and take notes",
  description:
    "A simple, powerful, minimalistic, markdown based note taking and journaling app all that you need!",
  openGraph: {
    title: "Retro Note - A place to journal and take notes",
    type: "website",
    images: "./og.png",
    url: "https://retronote.app",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
