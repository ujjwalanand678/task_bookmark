import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MarkIt | Simple, Private Bookmark Manager",
  description: "A lightning-fast, real-time bookmark manager built for modern thinkers. Save what matters, instantly.",
  keywords: ["bookmark manager", "nextjs", "supabase", "real-time", "privacy"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
