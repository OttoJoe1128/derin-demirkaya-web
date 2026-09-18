import ArchiveCanvas from "@/app/arsiv/page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sinematik Arşiv — Derin Buse Demirkaya | nonvalue jewel",
  description: "Ateşin dönüştürücü gücüyle şekillenen uzamsal nesne ve heykelsi takı arşivi.",
};

export default function LocalizedArchivePage() {
  // [lang]/layout.tsx zaten AppLayoutShell ve Footer sarmalamasını tekil olarak sağlıyor.
  return <ArchiveCanvas />;
}
