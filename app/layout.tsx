import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://smilehub.com'),
  title: "Smile Hub - Your Perfect Smile Starts Here",
  description: "Experience exceptional dental care with our team of expert dentists. We combine cutting-edge technology with compassionate care to give you the smile you deserve. Book your appointment today!",
  keywords: [
    "dental clinic",
    "dentist",
    "dental care",
    "teeth whitening",
    "dental implants",
    "orthodontics",
    "root canal",
    "pediatric dentistry",
    "Smile Hub",
    "dental appointments",
  ],
  authors: [{ name: "Smile Hub Team" }],
  icons: {
    icon: "/tooth-icon.svg",
    apple: "/tooth-icon.svg",
  },
  openGraph: {
    title: "Smile Hub - Your Perfect Smile Starts Here",
    description: "Experience exceptional dental care with our team of expert dentists. Book your appointment today!",
    url: "https://smilehub.com",
    siteName: "Smile Hub",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Smile Hub Dental Clinic",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Smile Hub - Your Perfect Smile Starts Here",
    description: "Experience exceptional dental care with our team of expert dentists.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}