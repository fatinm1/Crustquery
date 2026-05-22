import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CrustQuery",
  description: "Natural language search for B2B data powered by Crustdata + Claude",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
