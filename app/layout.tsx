import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CustomCursor from "../components/CustomCursor";
import Providers from "../components/Providers";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Derin Demirkaya — nonvalue jewel",
  description: "nonvalue • contemporary jewelry, spatial objects and archive by Derin Buse Demirkaya.",
  openGraph: {
    title: "Derin Demirkaya — nonvalue jewel",
    description: "nonvalue • contemporary jewelry, spatial objects and archive by Derin Buse Demirkaya.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${inter.variable} ${playfair.variable}`}>
      <body
        className="font-sans min-h-screen flex flex-col bg-neutral-50 text-neutral-800 md:cursor-none"
        suppressHydrationWarning
      >
        <Providers>
          <CustomCursor />
          <Header />
          <main className="flex-grow w-full">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}

