import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import Navbar from "../components/navbar";
import { cn } from "@/lib/utils";

import "./globals.css";

const fontSans = FontSans({ 
  subsets: ["latin"],
  variable: "--font-sans" 
});

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
    <html lang="en" suppressHydrationWarning>
      <head>
      <link rel="icon" href="/public/favicon.svg" type="image/svg+xml" />

      </head>
      <body 
      className={cn(
        "min-h-screen bg-background font-sans antialiased",
        fontSans.variable
      )}
      >
        <Navbar />
        <main className="container mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}
