import { notFound } from "next/navigation";
import { getArtworkByIdOrSlug, ARTWORKS_DATA } from "@/lib/artworks-data";
import ArtworkClient from "@/components/ArtworkClient";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ lang: string; id: string }>;
}

export async function generateStaticParams() {
  const params: { lang: string; id: string }[] = [];
  for (const lang of ["tr", "en"]) {
    for (const artwork of ARTWORKS_DATA) {
      params.push({ lang, id: artwork.id });
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, lang } = await params;
  const isEn = lang === "en";
  const artwork = getArtworkByIdOrSlug(id);

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
  const artwork = getArtworkByIdOrSlug(id);

  if (!artwork) {
    notFound();
  }

  return <ArtworkClient artwork={artwork} />;
}
