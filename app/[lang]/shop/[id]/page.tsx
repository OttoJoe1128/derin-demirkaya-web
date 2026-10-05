import { notFound } from "next/navigation";
import { getArtworkByIdOrSlug, type ArtworkDetail } from "@/lib/artworks-data";
import { getStoredArtworks } from "@/lib/admin-store";
import ArtworkClient from "@/components/ArtworkClient";
import type { Metadata } from "next";

export const dynamicParams = true;

interface Props {
  params: Promise<{ lang: string; id: string }>;
}

function findArtwork(idOrSlug: string): ArtworkDetail | undefined {
  const stored = getStoredArtworks();
  const match = stored.find(
    (a) => a.id === idOrSlug || a.slug === idOrSlug
  );
  if (match) return match;
  return getArtworkByIdOrSlug(idOrSlug);
}

export async function generateStaticParams() {
  const params: { lang: string; id: string }[] = [];
  const allArtworks = getStoredArtworks();
  for (const lang of ["tr", "en"]) {
    for (const artwork of allArtworks) {
      params.push({ lang, id: String(artwork.id) });
      if (artwork.slug) {
        params.push({ lang, id: String(artwork.slug) });
      }
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, lang } = await params;
  const isEn = lang === "en";
  const decodedId = decodeURIComponent(id);
  const artwork = findArtwork(decodedId) || findArtwork(id);

  if (!artwork) {
    return {
      title: isEn ? "Specimen Not Found — Derin Demirkaya" : "Eser Bulunamadı — Derin Demirkaya",
    };
  }

  const title = artwork.title;
  const desc = isEn ? artwork.descriptionEn || artwork.description : artwork.description;

  return {
    title: `${title} — Derin Demirkaya | nonvalue jewel`,
    description: `${title} (${artwork.category}, ${artwork.year}). ${desc}`,
    openGraph: {
      title: `${title} — Derin Demirkaya`,
      description: desc,
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

export default async function LocalizedArtworkDetailPage({ params }: Props) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);
  const artwork = findArtwork(decodedId) || findArtwork(id);

  if (!artwork) {
    notFound();
  }

  return <ArtworkClient artwork={artwork} />;
}
