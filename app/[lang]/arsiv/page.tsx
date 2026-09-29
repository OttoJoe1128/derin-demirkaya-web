import type { Metadata } from 'next';
import CinematicCanvasPortal from '@/components/CinematicCanvasPortal';

export const metadata: Metadata = {
  title: "Sinematik Arşiv — Derin Buse Demirkaya | nonvalue jewel",
  description: "Ateşin dönüştürücü gücüyle şekillenen uzamsal nesne ve heykelsi takı arşivi.",
};

export default function LocalizedArchivePage() {
  return (
    <div className="w-full min-h-screen bg-black text-neutral-200 pt-16 sm:pt-20 pb-16">
      <CinematicCanvasPortal />
    </div>
  );
}
