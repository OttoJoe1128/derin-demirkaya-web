import AppLayoutShell from "@/components/AppLayoutShell";
import { getDictionary } from "@/lib/get-dictionary";
import CollectionPageClient from "@/components/CollectionPageClient";

export const metadata = {
  title: "nonvalue • archive — Derin Buse Demirkaya",
  description: "Süreç odaklı çağdaş takı, mekansal heykel ve eskiz arşivi. Ateşin dönüştürücü gücüyle şekillenen 2018–2025 eserleri.",
};

export default async function KoleksiyonPage() {
  const dict = await getDictionary('tr');
  return (
    <AppLayoutShell lang="tr" dict={dict}>
      <CollectionPageClient lang="tr" dict={dict} />
    </AppLayoutShell>
  );
}
