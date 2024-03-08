import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "../components/navbar"
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "文心樂丞診所量表",
  description: "心理健康自我評估平台",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main className="container mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}
