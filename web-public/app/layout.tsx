import { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RetroNote - A markdown based writing app for all your needs",
  description:
    "RetroNote is a web based note taking app. It simple, distraction free, markdown based for all your academic, research, blogging, and writing needs!",
  openGraph: {
    title: "RetroNote - A markdown based writing app for all your needs",
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
