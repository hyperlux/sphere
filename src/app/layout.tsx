import type { Metadata } from "next";
// Replace Geist fonts with Inter
import { Inter } from "next/font/google";
import "./globals.css";

// Configure Inter font
const inter = Inter({
  variable: "--font-inter", // Use a standard variable name
  subsets: ["latin"],
});

// Remove Geist Mono configuration
// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Apply only the Inter font variable */}
      <body className={`${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
