import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Veritas Weather",
  description: "Weather data management and forecasting platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrainsMono.variable}`}>
        <nav className="mainNav">
          <div className="navContainer">
            <Link href="/" className="navLink">
              Home
            </Link>
            <Link href="/profile" className="navLink">
              Profile
            </Link>
            <Link href="/admin" className="navLink">
              Admin Panel
            </Link>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
