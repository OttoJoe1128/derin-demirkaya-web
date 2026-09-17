import AppLayoutShell from "@/components/AppLayoutShell";
import { getDictionary } from "@/lib/get-dictionary";

export default async function ProfilLayout({ children }: { children: React.ReactNode }) {
  const dict = await getDictionary('tr');
  return <AppLayoutShell lang="tr" dict={dict}>{children}</AppLayoutShell>;
}
