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

  return <ArtworkClient artwork={artwork} />;
}
