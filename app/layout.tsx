import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
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
  description: "nonvalue • contemporary jewelry, spatial objects and archive by Derin Buse Demirkaya. Hand-forged silver, lost-wax casting, and situational craft.",
  keywords: [
    "Derin Buse Demirkaya",
    "nonvalue jewel",
    "contemporary jewelry",
    "çağdaş takı",
    "heykelsi takı",
    "lost-wax casting",
    "kayıp mum döküm",
    "brutalist jewelry",
    "art jewelry",
    "silver craft",
    "jewelry workshop istanbul",
  ],
  authors: [{ name: "Derin Buse Demirkaya", url: "https://instagram.com/nonvalue_jewel" }],
  creator: "Derin Buse Demirkaya",
  publisher: "nonvalue jewel",
  openGraph: {
    title: "Derin Demirkaya — nonvalue jewel",
    description: "nonvalue • contemporary jewelry, spatial objects and archive by Derin Buse Demirkaya.",
    type: "website",
    locale: "tr_TR",
    siteName: "nonvalue jewel",
    images: [
      {
        url: "https://raw.githubusercontent.com/sircaedebiyat/derin-demirkaya-web/main/public/images/IMG_2302.JPG",
        width: 1200,
        height: 900,
        alt: "nonvalue jewel • Derin Buse Demirkaya Contemporary Jewelry Archive",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Derin Demirkaya — nonvalue jewel",
    description: "nonvalue • contemporary jewelry, spatial objects and archive by Derin Buse Demirkaya.",
    images: ["https://raw.githubusercontent.com/sircaedebiyat/derin-demirkaya-web/main/public/images/IMG_2302.JPG"],
  },
};

const jsonLdGlobal = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Person", "VisualArtist"],
      "@id": "https://nonvaluejewel.com/#artist",
      "name": "Derin Buse Demirkaya",
      "alternateName": "nonvalue jewel",
      "jobTitle": "Contemporary Jewelry Designer & Sculptor",
      "description": "Contemporary jewelry artist based in Izmir & Istanbul, educated at Marmara University and Hochschule Düsseldorf.",
      "sameAs": ["https://instagram.com/nonvalue_jewel"],
      "alumniOf": [
        {
          "@type": "CollegeOrUniversity",
          "name": "Marmara University School of Jewelry Technology and Design",
        },
        {
          "@type": "CollegeOrUniversity",
          "name": "Hochschule Düsseldorf (HSD)",
        },
      ],
    },
    {
      "@type": ["JewelryStore", "ArtGallery"],
      "@id": "https://nonvaluejewel.com/#studio",
      "name": "nonvalue jewel",
      "founder": {
        "@id": "https://nonvaluejewel.com/#artist",
      },
      "description": "Studio of process-based contemporary jewelry, sculptural objects, and lost-wax casting workshops.",
      "email": "nonvaluejewel@gmail.com",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Beyoğlu / Karaköy",
        "addressRegion": "İstanbul / İzmir",
        "addressCountry": "TR",
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://nonvaluejewel.com/#website",
      "url": "https://nonvaluejewel.com",
      "name": "Derin Demirkaya — nonvalue jewel",
      "publisher": {
        "@id": "https://nonvaluejewel.com/#studio",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGlobal) }}
        />
      </head>
      <body
        className="font-sans min-h-screen bg-neutral-950 text-neutral-100 md:cursor-none antialiased"
        suppressHydrationWarning
      >
        <Providers>
          <CustomCursor />
          {children}
        </Providers>
      </body>
    </html>
  );
}
