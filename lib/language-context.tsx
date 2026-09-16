'use client';

import React, { createContext, useContext, useState } from 'react';

export type Language = 'TR' | 'EN';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  TR: {
    // Navigasyon
    'nav.collection': 'Koleksiyon',
    'nav.archive': 'Sinematik Arşiv',
    'nav.workshops': 'Atölye Takvimi',
    'nav.about': 'Hakkında',
    'nav.contact': 'İletişim',
    'nav.login': 'Giriş / Kayıt',
    'nav.profile': 'Koleksiyoner Paneli',
    'nav.logout': 'Çıkış',
    'nav.soundOn': 'SES: AÇIK',
    'nav.soundOff': 'SES: KAPALI',

    // Hero Section (Professional Gallery Framing)
    'hero.brand': 'NONVALUE JEWEL',
    'hero.designer': 'DERİN BUSE DEMİRKAYA',
    'hero.brandSubtitle': 'Çağdaş Takı & Uzamsal Nesne Pratiği // 2018–2025',
    'hero.manifestoTag': 'Ateşin dönüştürücü kuvveti, malzeme karşılaşmaları ve yaşayan yüzeyler.',
    'hero.explore': 'Koleksiyonu Keşfet',
    'hero.archive': 'Sinematik Arşiv',
    'hero.workshops': 'Atölye Takvimi →',
    'hero.artworkLabel': 'ÖNE ÇIKAN HEYKELSİ ESER // SELFLOVE (1/1)',
    'hero.specimenArchive': 'SERGİ VE ATÖLYE KAYDI',

    // Koleksiyon & Slider
    'collection.title': 'Koleksiyon',
    'collection.archive': 'Arşivi',
    'collection.subtitle': 'Editoryal Brutalizm Slide Sergi',
    'collection.all': 'TÜM ENVANTER',
    'collection.unique': '1/1 Eşsiz Parça',
    'collection.edition': 'Limitli Seri',
    'collection.activeSpecimen': 'AKTİF ESER // REF',
    'collection.prev': 'ÖNCEKİ',
    'collection.next': 'SONRAKİ',
    'collection.dragHint': '← SÜRÜKLEYİN VEYA OK TUŞLARIYLA KAYDIRIN →',
    'collection.view3d': '3D PARALLAX İNCELE',
    'collection.goToCollection': 'Koleksiyona Git',
    'collection.details': '3D Uzamsal Parallax Detay',
    'collection.viewMode.slide': 'Slide (Kayar)',
    'collection.viewMode.grid': 'Izgara',
    'collection.viewMode.table': 'Teknik Tablo',

    // Sinematik Portal
    'portal.liveSpace': 'SİNEMATİK TUVAL • CANLI SERGİ UZAYI',
    'portal.title': 'Sonsuz Arşiv Tuvali',
    'portal.desc': 'Karanlık oda atmosferinde, analog ses rezonansı, 2.39:1 Cinemascope çerçevesi ve serbest süzülme fiziği ile tüm üretim sürecini uzamsal olarak deneyimleyin.',
    'portal.enter': 'SİNEMATİK TUVALE GİRİŞ YAP',
    'portal.coordinates': 'KOORDİNATLAR: 38.4192° N, 27.1287° E • İZMİR / İSTANBUL',

    // Atölye
    'workshop.title': 'Atölye & Zanaat Takvimi',
    'workshop.subtitle': 'Kayıp mum tekniği ve heykelsi takı döküm seansları.',
    'workshop.bookNow': 'Rezervasyon Yap',
    'workshop.full': 'Kontenjan Doldu',
    'workshop.remaining': 'Kalan Koltuk',
    'workshop.enrolled': 'Kayıtlı Katılımcı',
    'workshop.instructor': 'Eğitmen',
    'workshop.location': 'Lokasyon',
    'workshop.duration': 'Süre',
    'workshop.included': 'Dahil Olanlar',
    'workshop.fee': 'Kişi Başı Ücret',

    // Auth & Profil
    'auth.welcomeBack': 'Koleksiyoner Girişi',
    'auth.welcomeBackSub': 'Atölye rezervasyonlarınızı, dijital biletlerinizi ve özel arşivinizi yönetin.',
    'auth.email': 'E-Posta Adresi',
    'auth.password': 'Parola',
    'auth.name': 'Ad Soyad',
    'auth.phone': 'Telefon Numarası',
    'auth.signIn': 'Giriş Yap',
    'auth.signUp': 'Kayıt Ol',
    'auth.quickDemo': 'Tek Tıkla Demo Koleksiyoner Girişi',
    'auth.noAccount': 'Henüz bir koleksiyoner hesabınız yok mu?',
    'auth.haveAccount': 'Zaten bir hesabınız var mı?',
    'auth.createAccount': 'Koleksiyoner Hesabı Oluştur',
    'auth.createAccountSub': 'Öncelikli atölye rezervasyonu ve kişisel takı arşivi için kaydolun.',

    // Profil Sayfası
    'profile.title': 'Koleksiyoner Portalı',
    'profile.badge': 'ONAYLI SANAT SEVER // ATÖLYE ÜYESİ',
    'profile.tabReservations': 'Atölye Rezervasyonlarım',
    'profile.tabAccount': 'Profil Bilgileri',
    'profile.tabSaved': 'Kaydedilen Eserler',
    'profile.activeTicket': 'DİJİTAL ATÖLYE GİRİŞ BİLETİ',
    'profile.cancelReservation': 'Rezervasyonu İptal Et',
    'profile.ticketCode': 'BİLET KODU',
    'profile.saveChanges': 'Bilgileri Güncelle',
    'profile.emptyReservations': 'Henüz kayıtlı bir atölye rezervasyonunuz bulunmuyor.',
    'profile.browseWorkshops': 'Atölye Takvimini İncele',

    // Footer
    'footer.rights': 'Tüm hakları saklıdır.',
  },
  EN: {
    // Navigation
    'nav.collection': 'Collection',
    'nav.archive': 'Cinematic Archive',
    'nav.workshops': 'Workshops',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.login': 'Sign In / Register',
    'nav.profile': 'Collector Portal',
    'nav.logout': 'Sign Out',
    'nav.soundOn': 'AUDIO: ON',
    'nav.soundOff': 'AUDIO: OFF',

    // Hero Section (Professional Gallery Framing)
    'hero.brand': 'NONVALUE JEWEL',
    'hero.designer': 'DERİN BUSE DEMİRKAYA',
    'hero.brandSubtitle': 'Contemporary Jewelry & Spatial Objects // 2018–2025',
    'hero.manifestoTag': 'Transformative force of fire, material encounters, and living sculptural surfaces.',
    'hero.explore': 'Explore Collection',
    'hero.archive': 'Cinematic Archive',
    'hero.workshops': 'Workshops & Calendar →',
    'hero.artworkLabel': 'FEATURED SCULPTURAL SPECIMEN // SELFLOVE (1/1)',
    'hero.specimenArchive': 'EXHIBITION & STUDIO ARCHIVE',

    // Collection & Slider
    'collection.title': 'Collection',
    'collection.archive': 'Archive',
    'collection.subtitle': 'Editorial Brutalism Slide Exhibition',
    'collection.all': 'FULL ARCHIVE',
    'collection.unique': '1/1 Unique Piece',
    'collection.edition': 'Limited Edition',
    'collection.activeSpecimen': 'ACTIVE SPECIMEN // REF',
    'collection.prev': 'PREV',
    'collection.next': 'NEXT',
    'collection.dragHint': '← DRAG HORIZONTALLY OR USE ARROW KEYS →',
    'collection.view3d': '3D PARALLAX VIEW',
    'collection.goToCollection': 'View Collection',
    'collection.details': '3D Spatial Parallax Detail',
    'collection.viewMode.slide': 'Slide Reel',
    'collection.viewMode.grid': 'Grid',
    'collection.viewMode.table': 'Technical Table',

    // Cinematic Portal
    'portal.liveSpace': 'CINEMATIC CANVAS • LIVE EXHIBITION SPACE',
    'portal.title': 'Infinite Archive Canvas',
    'portal.desc': 'Experience the entire body of work spatially in a darkroom atmosphere with analog drone resonance, 2.39:1 Cinemascope framing, and free-floating physics.',
    'portal.enter': 'ENTER CINEMATIC CANVAS',
    'portal.coordinates': 'COORDINATES: 38.4192° N, 27.1287° E • IZMIR / ISTANBUL',

    // Workshops
    'workshop.title': 'Workshop & Craft Calendar',
    'workshop.subtitle': 'Lost-wax casting and sculptural jewelry studio sessions.',
    'workshop.bookNow': 'Book Reservation',
    'workshop.full': 'Fully Booked',
    'workshop.remaining': 'Remaining Seats',
    'workshop.enrolled': 'Enrolled Participants',
    'workshop.instructor': 'Instructor',
    'workshop.location': 'Studio Location',
    'workshop.duration': 'Duration',
    'workshop.included': 'Materials Included',
    'workshop.fee': 'Fee per Participant',

    // Auth & Profile
    'auth.welcomeBack': 'Collector Sign In',
    'auth.welcomeBackSub': 'Manage your workshop reservations, digital tickets, and curated archive.',
    'auth.email': 'Email Address',
    'auth.password': 'Password',
    'auth.name': 'Full Name',
    'auth.phone': 'Phone Number',
    'auth.signIn': 'Sign In',
    'auth.signUp': 'Register',
    'auth.quickDemo': '1-Click Demo Collector Access',
    'auth.noAccount': "Don't have a collector account yet?",
    'auth.haveAccount': 'Already have an account?',
    'auth.createAccount': 'Create Collector Account',
    'auth.createAccountSub': 'Sign up for priority workshop access and personal jewelry curation.',

    // Profile Page
    'profile.title': 'Collector Portal',
    'profile.badge': 'VERIFIED ARTISAN MEMBER',
    'profile.tabReservations': 'My Workshop Reservations',
    'profile.tabAccount': 'Account Details',
    'profile.tabSaved': 'Curated Pieces',
    'profile.activeTicket': 'DIGITAL STUDIO PASS',
    'profile.cancelReservation': 'Cancel Booking',
    'profile.ticketCode': 'PASS CODE',
    'profile.saveChanges': 'Save Changes',
    'profile.emptyReservations': 'You currently have no active workshop bookings.',
    'profile.browseWorkshops': 'Browse Workshop Calendar',

    // Footer
    'footer.rights': 'All rights reserved.',
  },
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'TR',
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (key: string) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window === 'undefined') return 'TR';
    const saved = localStorage.getItem('derin_lang') as Language;
    return (saved === 'TR' || saved === 'EN') ? saved : 'TR';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('derin_lang', lang);
  };

  const toggleLanguage = () => {
    const next = language === 'TR' ? 'EN' : 'TR';
    setLanguage(next);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
