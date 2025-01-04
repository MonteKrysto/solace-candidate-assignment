import type { Metadata } from "next";
import Providers from "./providers";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Solace Candidate Assignment",
  description: "Show us what you got",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col w-full justify-center bg-gray-100">
          <div className="w-full max-w-8xl px-4 py-8 bg-white shadow-md rounded-lg">
            <Providers>{children}</Providers>
          </div>
        </div>
      </body>
    </html>
  );
}
