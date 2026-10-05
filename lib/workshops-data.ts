export interface WorkshopItem {
  id: string;
  slug: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  category: 'casting' | 'wheel' | 'chemistry' | 'sculpture' | 'kintsugi';
  categoryTitle: string;
  categoryTitleEn: string;
  instructor: string;
  location: string;
  locationEn: string;
  durationMinutes: number;
  price: string;
  rawPrice: number;
  capacity: number;
  enrolledCount: number;
  dateOffsetDays: number;
  hour: number;
  imageUrl: string;
  materialsIncluded: string;
  materialsIncludedEn: string;
}

// Örnek atölyeler kaldırıldı; gerçek atölyeler stüdyo admin paneli üzerinden dinamik olarak oluşturulur ve yönetilir.
export const WORKSHOPS_DATA: WorkshopItem[] = [];
