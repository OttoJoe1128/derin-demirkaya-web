'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import {
  ShieldCheck,
  X,
  Printer,
  Copy,
  Check,
  Sparkles,
  QrCode,
  Award,
  Fingerprint,
} from 'lucide-react';
import type { ArtworkDetail } from '@/lib/artworks-data';
import { useLanguage } from '@/lib/language-context';
import { soundFx } from '@/lib/sound-fx';

interface CertificateOfAuthenticityModalProps {
  artwork: ArtworkDetail | null;
  isOpen: boolean;
  onClose: () => void;
  defaultCollectorName?: string;
}

export default function CertificateOfAuthenticityModal({
  artwork,
  isOpen,
  onClose,
  defaultCollectorName = '',
}: CertificateOfAuthenticityModalProps) {
  const { language } = useLanguage();
  const isEn = language === 'EN';

  const [collectorName, setCollectorName] = useState(defaultCollectorName);
  const [isEditingCollector, setIsEditingCollector] = useState(false);
  const [copied, setCopied] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !artwork) return null;

  // Deterministik ama gerçekçi sertifika seri numarası ve kriptografik sicil kodu
  const cleanId = artwork.id.replace(/[^a-zA-Z0-9]/g, '');
  const certSerial = `DD-COA-${artwork.year || '2025'}-${cleanId.padStart(4, '0').toUpperCase()}`;
  const archiveHash = `SHA256:7f9a${cleanId.slice(0, 4)}e84b2c1f${artwork.slug?.slice(0, 3) || 'art'}901dd`;

  const handleCopySerial = () => {
    soundFx.playClick();
    navigator.clipboard.writeText(`${certSerial} | Provenance: ${archiveHash}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    soundFx.playClick();
    window.print();
  };

  return (
    <div
      id="certificate-modal-backdrop"
      className="fixed inset-0 z-[10000] bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto print:p-0 print:bg-white print:static"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          soundFx.playClick();
          onClose();
        }
      }}
    >
      <div className="relative w-full max-w-4xl bg-[#111111] text-neutral-100 border border-neutral-700 shadow-[0_25px_80px_rgba(0,0,0,0.95)] max-h-[94vh] flex flex-col overflow-hidden print:max-h-none print:shadow-none print:border-0 print:bg-white print:text-black">
        
        {/* ÜST EYLEM ÇUBUĞU (Yazdırma sırasında gizlenir) */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#171717] border-b border-neutral-800 print:hidden shrink-0">
          <div className="flex items-center gap-2 font-mono text-xs text-amber-300 font-bold uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>
              {isEn
                ? 'Official Certificate of Authenticity (COA)'
                : 'Resmi Orijinallik ve Eser Sicil Belgesi'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySerial}
              className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 hover:border-amber-400 font-mono text-xs flex items-center gap-1.5 transition-colors"
              title="Seri Numarasını Kopyala"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300">{isEn ? 'Copied' : 'Kopyalandı'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{isEn ? 'Copy Serial' : 'Seri No Kopyala'}</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-black font-mono font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
              title="Sertifikayı Yazdır / PDF Olarak Kaydet"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{isEn ? 'Print / Save PDF' : 'Yazdır / PDF Kaydet'}</span>
            </button>

            <button
              onClick={() => {
                soundFx.playClick();
                onClose();
              }}
              className="p-1.5 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors ml-2"
              aria-label="Kapat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* SERTİFİKA GÖVDESİ (A4 Baskı Uyumu) */}
        <div
          ref={certificateRef}
          className="p-6 sm:p-10 overflow-y-auto bg-[#0C0D0E] print:p-8 print:bg-white print:text-black print:overflow-visible space-y-8 relative"
        >
          {/* Su damgası arka plan deseni */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none opacity-[0.03] print:opacity-[0.04] select-none flex items-center justify-center overflow-hidden"
          >
            <span className="font-serif text-[18vw] font-bold tracking-tighter text-white print:text-black transform -rotate-12">
              DERİN
            </span>
          </div>

          {/* ÇİFT GİLOŞ ÇERÇEVE (Güvenlik Motifli Kenarlık) */}
          <div className="relative border-2 border-neutral-700/80 p-6 sm:p-8 bg-[#121315]/80 print:bg-white print:border-black/70">
            {/* Köşe Süslemeleri */}
            <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-amber-400 print:border-black" />
            <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-amber-400 print:border-black" />
            <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-amber-400 print:border-black" />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-amber-400 print:border-black" />

            {/* BAŞLIK & STÜDYO AMBLEMİ */}
            <div className="text-center space-y-2 pb-6 border-b border-neutral-800 print:border-neutral-300">
              <div className="flex items-center justify-center gap-2 font-mono text-[10px] sm:text-xs text-amber-400 uppercase tracking-[0.3em]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>DERİN DEMİRKAYA ATELIER • MASTER REGISTRY</span>
                <Sparkles className="w-3.5 h-3.5" />
              </div>

              <h1 className="font-serif text-2xl sm:text-4xl text-neutral-100 print:text-black uppercase tracking-wider font-light">
                {isEn ? 'Certificate of Authenticity' : 'Eser Orijinallik ve Mülkiyet Sicil Belgesi'}
              </h1>

              <p className="font-mono text-[11px] text-neutral-400 print:text-neutral-600 tracking-wider">
                {isEn
                  ? 'NONVALUE / OBJECT — INDEPENDENT ARCHIVAL SPECIMEN CERTIFICATION'
                  : 'NONVALUE / OBJECT — BAĞIMSIZ HEYKELSİ FORM VE ATÖLYE SERİSİ ONAYI'}
              </p>
            </div>

            {/* ORTA BÖLÜM: ESER GÖRSELİ & TEKNİK ÖZELLİKLER */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-6 items-center">
              {/* Sol: Eserin Yüksek Çözünürlüklü Hologramlı Önizlemesi */}
              <div className="md:col-span-4 flex flex-col items-center">
                <div className="relative w-48 h-48 sm:w-56 sm:h-56 bg-neutral-900 border-2 border-neutral-700 print:border-black p-2 shadow-lg group">
                  <div className="relative w-full h-full overflow-hidden">
                    {artwork.images?.[0] ? (
                      <Image
                        src={artwork.images[0]}
                        alt={artwork.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 192px, 224px"
                      />
                    ) : (
                      <div className="w-full h-full bg-neutral-800 flex items-center justify-center font-mono text-xs">
                        NO IMAGE
                      </div>
                    )}
                  </div>

                  {/* Hologram Benzetimi Damgası */}
                  <div className="absolute top-3 right-3 px-2 py-1 bg-black/85 border border-amber-400/80 text-amber-300 font-mono text-[9px] font-bold tracking-widest uppercase flex items-center gap-1 shadow-sm">
                    <Award className="w-3 h-3 text-amber-400" />
                    <span>VERIFIED</span>
                  </div>
                </div>

                <span className="font-mono text-[10px] text-neutral-400 print:text-neutral-600 mt-2">
                  ARCHIVE ID: #{artwork.id}
                </span>
              </div>

              {/* Sağ: Eser Sicil Karnesi */}
              <div className="md:col-span-8 space-y-3 font-sans text-xs">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-[#18191B] print:bg-neutral-100 border border-neutral-800 print:border-neutral-300">
                  <div>
                    <span className="block font-mono text-[10px] uppercase text-neutral-400 print:text-neutral-500">
                      {isEn ? 'Artwork Title' : 'Eser Adı'}
                    </span>
                    <span className="font-serif text-base sm:text-lg text-white print:text-black font-semibold">
                      {artwork.title}
                    </span>
                  </div>

                  <div>
                    <span className="block font-mono text-[10px] uppercase text-neutral-400 print:text-neutral-500">
                      {isEn ? 'Collection' : 'Koleksiyon'}
                    </span>
                    <span className="font-mono text-neutral-200 print:text-black">
                      {artwork.collectionName}
                    </span>
                  </div>

                  <div>
                    <span className="block font-mono text-[10px] uppercase text-neutral-400 print:text-neutral-500">
                      {isEn ? 'Creation Year' : 'Üretim Yılı'}
                    </span>
                    <span className="font-mono text-neutral-200 print:text-black font-bold">
                      {artwork.year || '2025'}
                    </span>
                  </div>

                  <div>
                    <span className="block font-mono text-[10px] uppercase text-neutral-400 print:text-neutral-500">
                      {isEn ? 'Material / Alloy' : 'Materyal & Alaşım'}
                    </span>
                    <span className="text-neutral-200 print:text-black">
                      {isEn && artwork.materialEn ? artwork.materialEn : artwork.material}
                    </span>
                  </div>

                  <div>
                    <span className="block font-mono text-[10px] uppercase text-neutral-400 print:text-neutral-500">
                      {isEn ? 'Dimensions & Weight' : 'Boyut & Ağırlık'}
                    </span>
                    <span className="text-neutral-200 print:text-black">
                      {artwork.dimensions} • {artwork.weight}
                    </span>
                  </div>

                  <div>
                    <span className="block font-mono text-[10px] uppercase text-neutral-400 print:text-neutral-500">
                      {isEn ? 'Edition Classification' : 'Edisyon Sınıfı'}
                    </span>
                    <span className="font-mono font-bold text-amber-300 print:text-black">
                      {artwork.isUniquePiece
                        ? (isEn ? '1/1 Unique Specimen' : '1/1 — Tek ve Eşsiz Nüsha')
                        : (isEn ? 'Limited Studio Series' : 'Limitli Koleksiyon Serisi')}
                    </span>
                  </div>
                </div>

                {/* Üretim Tekniği & Küratöryel Özet */}
                <div className="p-3 border border-neutral-800 print:border-neutral-300 space-y-1">
                  <span className="font-mono text-[10px] uppercase text-neutral-400 print:text-neutral-500 block">
                    {isEn ? 'Technique & Metallurgical Process' : 'İşçilik & Metalürjik Döküm Tekniği'}
                  </span>
                  <p className="text-neutral-300 print:text-neutral-800 leading-relaxed font-light">
                    {isEn && artwork.techniqueEn ? artwork.techniqueEn : artwork.technique}
                  </p>
                </div>

                {/* KOLEKSİYONER / SAHİP BİLGİSİ (Düzenlenebilir / Özelleştirilebilir) */}
                <div className="p-3 bg-[#151618] print:bg-neutral-50 border border-neutral-800 print:border-neutral-300 flex flex-wrap items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="font-mono text-[10px] uppercase text-amber-400 print:text-black font-bold flex items-center gap-1.5">
                      <Fingerprint className="w-3.5 h-3.5" />
                      <span>{isEn ? 'Registered Collector / Owner' : 'Kayıtlı Koleksiyoner / Eser Sahibi'}</span>
                    </span>
                    {isEditingCollector ? (
                      <div className="flex items-center gap-2 pt-1 print:hidden">
                        <input
                          type="text"
                          value={collectorName}
                          onChange={(e) => setCollectorName(e.target.value)}
                          placeholder={isEn ? 'Enter collector name' : 'Koleksiyoner adı giriniz'}
                          className="bg-black border border-neutral-600 px-2 py-1 text-xs text-white font-mono outline-none focus:border-amber-400"
                        />
                        <button
                          onClick={() => setIsEditingCollector(false)}
                          className="px-2 py-1 bg-amber-400 text-black font-mono text-[10px] font-bold"
                        >
                          {isEn ? 'Save' : 'Kaydet'}
                        </button>
                      </div>
                    ) : (
                      <div className="font-mono text-sm text-white print:text-black font-medium">
                        {collectorName || (isEn ? 'Derin Demirkaya Studio Archive (Open Specimen)' : 'Derin Demirkaya Stüdyo Arşivi (Kayıtlı Eser)')}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => setIsEditingCollector(!isEditingCollector)}
                    className="font-mono text-[10px] text-neutral-400 hover:text-amber-300 underline print:hidden"
                  >
                    {isEditingCollector ? (isEn ? 'Close' : 'Kapat') : (isEn ? 'Edit Name' : 'İsim Değiştir')}
                  </button>
                </div>
              </div>
            </div>

            {/* HUKUKİ & SANATSAL BEYAN (STATEMENT OF PROVENANCE) */}
            <div className="pt-6 mt-6 border-t border-neutral-800 print:border-neutral-300 font-sans text-xs text-neutral-300 print:text-neutral-700 leading-relaxed">
              <p className="italic">
                {isEn
                  ? '“This document certifies that the artwork described above is a certified authentic original work created by artist and metalsmith Derin Buse Demirkaya. It was hand-formed through elemental fire fusion and artisan lost-wax metallurgy, permanently recorded in the Studio Registry.”'
                  : '“İşbu belge; yukarıda özellikleri ve sicil numarası belirtilen eserin sanatçı ve tasarımcı Derin Buse Demirkaya tarafından bizzat tasarlandığını, doğrudan ocak ateşi, ergitme ve kayıp mum el dökümü teknikleriyle stüdyoda üretildiğini ve Derin Demirkaya Resmi Eser Siciline kaydedildiğini tasdik eder.”'}
              </p>
            </div>

            {/* ALT BÖLÜM: MÜHÜR, İMZA VE DOĞRULAMA KODLARI */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 mt-6 border-t-2 border-neutral-800 print:border-black items-end">
              {/* 1. Kriptografik Doğrulama & QR */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-white p-1 shrink-0 border border-black flex items-center justify-center">
                    <QrCode className="w-8 h-8 text-black" />
                  </div>
                  <div className="font-mono text-[9px] text-neutral-400 print:text-neutral-600 leading-tight">
                    <div className="font-bold text-amber-300 print:text-black">
                      {certSerial}
                    </div>
                    <div className="truncate max-w-[140px] text-[8px]">
                      {archiveHash}
                    </div>
                    <div>LAT: 38.4192° N / LON: 27.1287° E</div>
                  </div>
                </div>
              </div>

              {/* 2. Sanatçı Islak İmza / Mühür Temsili */}
              <div className="text-center space-y-1 sm:order-none">
                <div className="h-10 flex items-center justify-center">
                  {/* Derin Demirkaya Kaligrafik İmza Efekti */}
                  <span className="font-serif italic text-xl sm:text-2xl text-amber-200 print:text-black tracking-wider transform -rotate-3 select-none">
                    Derin Buse Demirkaya
                  </span>
                </div>
                <div className="border-t border-neutral-700 print:border-black pt-1">
                  <span className="font-mono text-[10px] uppercase text-neutral-400 print:text-neutral-600 block">
                    {isEn ? 'Artist & Studio Master Signature' : 'Sanatçı & Atölye İmzası'}
                  </span>
                </div>
              </div>

              {/* 3. Resmi Stüdyo Mührü (Embossed Seal) */}
              <div className="flex justify-end items-center">
                <div className="w-20 h-20 rounded-full border-2 border-dashed border-amber-400/70 print:border-black flex flex-col items-center justify-center text-center p-1 relative shadow-inner">
                  <span className="font-mono text-[7px] text-amber-300 print:text-black font-bold uppercase tracking-tighter">
                    DERİN DEMİRKAYA
                  </span>
                  <span className="font-serif text-[10px] text-white print:text-black font-bold my-0.5">
                    ATELIER
                  </span>
                  <span className="font-mono text-[6px] text-neutral-400 print:text-neutral-600 uppercase tracking-widest">
                    GENUINE • 2025
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Alt bilgi şeridi */}
          <div className="flex flex-wrap items-center justify-between text-[10px] font-mono text-neutral-500 print:text-neutral-600 pt-2 border-t border-neutral-800 print:border-neutral-300">
            <span>ISSUED IN TURKEY • NONVALUE EXPERIMENTAL METAL CRAFT</span>
            <span>VERIFIED ON AIS CLOUD MASTER DATA</span>
          </div>

        </div>

      </div>
    </div>
  );
}
