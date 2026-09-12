import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Best Hotels in India | Book Direct at IndianHotels.co",
    template: "%s | IndianHotels.co",
  },
  description:
    "Premium hotel marketplace organised by India's top tourist attractions — Taj Mahal, Goa, Kerala, Jaipur, Varanasi. Verified reviews, best prices.",
  // Belt-and-suspenders alongside robots.ts: keeps the temporary *.netlify.app
  // deploy out of Google entirely until NEXT_PUBLIC_ALLOW_INDEXING=true is set
  // on the production custom-domain deploy.
  robots: process.env.NEXT_PUBLIC_ALLOW_INDEXING === 'true'
    ? { index: true, follow: true }
    : { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
