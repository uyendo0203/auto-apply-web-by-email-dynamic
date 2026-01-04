import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Auto Apply Web V2 - Gửi CV Chuyên Nghiệp",
  description: "Ứng tuyển công việc tự động, gửi CV chuyên nghiệp chỉ trong tích tắc",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>
        <SessionProvider>
          <main>
            {children}
          </main>
        </SessionProvider>
      </body>
    </html>
  );
}
