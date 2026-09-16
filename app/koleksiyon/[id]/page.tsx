import { notFound } from "next/navigation";
import { getArtworkByIdOrSlug, ARTWORKS_DATA } from "@/lib/artworks-data";
import ArtworkClient from "@/components/ArtworkClient";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return ARTWORKS_DATA.map((artwork) => ({
    id: artwork.id,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const artwork = getArtworkByIdOrSlug(id);

  if (!artwork) {
    return {
      title: "Eser Bulunamadı — Derin Demirkaya",
    };
  }

  return {
    title: `${artwork.title} — Derin Demirkaya`,
    description: `${artwork.title} (${artwork.category}, ${artwork.year}). ${artwork.description}`,
    openGraph: {
      title: `${artwork.title} — Derin Demirkaya`,
      description: artwork.description,
      images: [
        {
          url: artwork.images[0] || "",
          width: 1200,
          height: 900,
          alt: artwork.title,
        },
      ],
    },
  };
}

export default async function ArtworkDetailPage({ params }: Props) {
  const { id } = await params;
  const artwork = getArtworkByIdOrSlug(id);

  if (!artwork) {
    notFound();
  }

  // Schema.org VisualArtwork & Product structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["VisualArtwork", "Product"],
    "name": artwork.title,
    "image": artwork.images,
    "description": artwork.description,
    "artform": "Contemporary Jewelry / Spatial Sculpture",
    "artMedium": artwork.material,
    "artworkSurface": artwork.technique,
    "creator": {
      "@type": "Person",
      "name": "Derin Buse Demirkaya",
      "sameAs": "https://instagram.com/nonvalue_jewel",
    },
    "dateCreated": artwork.year,
    "offers": {
      "@type": "Offer",
      "price": artwork.price.replace(/[^\d.]/g, "") || "0",
      "priceCurrency": "TRY",
      "availability": artwork.isUniquePiece
        ? "https://schema.org/LimitedAvailability"
        : "https://schema.org/InStock",
      "seller": {
        "@type": "JewelryStore",
        "name": "nonvalue jewel",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ArtworkClient artwork={artwork} />
    </>
  );
}
