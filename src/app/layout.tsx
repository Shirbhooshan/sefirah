import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {Merriweather} from "next/font/google";
import localFont from "next/font/local";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const merriweather = Merriweather({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-merriweather',
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Sefirah",
  description: "A web operating system.",
};

const vgaFont = localFont({
  src: "../assets/fonts/Px437_IBM_VGA_8x16.ttf",
  variable: "--font-vga",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${vgaFont.variable} ${merriweather.variable}`}
      >
        {children}
      </body>
    </html>
  );
}