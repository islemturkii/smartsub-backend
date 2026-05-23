import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SmartSub - Subscription Tracker",
  description: "Detect and manage recurring subscriptions from bank transactions",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.className} h-full`}>
      <body className="min-h-full flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
          {children}
        </main>
        <footer className="border-t py-4 text-center text-xs text-gray-400">
          SmartSub MVP &copy; {new Date().getFullYear()}
        </footer>
      </body>
    </html>
  );
}
