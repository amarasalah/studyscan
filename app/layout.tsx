import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RegenScan — Scientific Study Analyzer",
  description: "Upload scientific studies to analyze publication status and RegenLab clinical relevance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-50 min-h-screen">
        {children}
      </body>
    </html>
  );
}
