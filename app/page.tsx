import Image from 'next/image';

export default function RootHomePage() {
  return (
    <main className="relative min-h-screen w-full bg-black overflow-hidden select-none">
      <Image
        src="/websites.jpg"
        alt=""
        fill
        priority
        className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-screen pointer-events-none"
        sizes="100vw"
        referrerPolicy="no-referrer"
      />
    </main>
  );
}
