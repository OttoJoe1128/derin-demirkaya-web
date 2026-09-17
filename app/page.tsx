import { getDictionary } from '@/lib/get-dictionary';
import EditorialMagazinePage from '@/components/EditorialMagazinePage';

export const metadata = {
  title: "Derin Demirkaya — nonvalue jewel | Çağdaş Takı ve Heykel Arşivi",
  description: "nonvalue • süreç odaklı çağdaş takı, mekansal heykel ve eskiz arşivi. Ateşin dönüştürücü gücüyle şekillenen 2018–2026 eserleri.",
};

export default async function RootHomePage() {
  const dict = await getDictionary('tr');
  return <EditorialMagazinePage lang="tr" dict={dict} />;
}
