import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "../lib/auth/AuthContext";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "VITB-MUN | The IPL Mega Auction",
  description:
    "Official Live Auction Platform for VIT Bhopal MUN Club IPL Mega Auction. 15 Franchises, ₹100 Cr virtual purse, real-time live bidding and squad evaluation.",
  keywords: [
    "IPL Auction",
    "VIT Bhopal MUN",
    "IPL Mega Auction",
    "Fantasy Cricket Auction",
    "Live Bidding",
    "VITB MUN Club",
  ],
  authors: [{ name: "VITB-MUN Technical Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-void text-silver-bright antialiased min-h-screen">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
