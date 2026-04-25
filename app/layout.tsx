import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Slate",
  description: "A minimal Kanban surface for focused work.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <body className={`${dmSans.variable} bg-[var(--slate-ink)] text-slate-50 antialiased overflow-x-hidden`}>
        {children}
      </body>
    </html>
  );
}

