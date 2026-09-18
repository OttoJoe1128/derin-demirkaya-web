import AppLayoutShell from "@/components/AppLayoutShell";
import { getDictionary } from "@/lib/get-dictionary";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sinematik Arşiv — Derin Buse Demirkaya | nonvalue jewel",
  description: "Ateşin dönüştürücü gücüyle şekillenen uzamsal nesne ve heykelsi takı arşivi.",
};

export default async function ArchiveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dict = await getDictionary('tr');
  return (
    <AppLayoutShell lang="tr" dict={dict}>
      {children}
    </AppLayoutShell>
  );
}
