import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sanatçı Stüdyosu & CMS | Derin Buse Demirkaya",
  description: "Derin Buse Demirkaya sanatçı yönetim paneli, tek ekran analitik ve entegre CMS stüdyosu.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#141414] text-neutral-100 selection:bg-amber-400 selection:text-black">
      {children}
    </div>
  );
}
