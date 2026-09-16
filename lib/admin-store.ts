import { ARTWORKS_DATA, type ArtworkDetail } from "./artworks-data";
import { WORKSHOPS_DATA, type WorkshopItem } from "./workshops-data";

export interface AdminOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: {
    title: string;
    quantity: number;
    price: number;
    imageUrl?: string;
  }[];
  totalAmount: number;
  currency: string;
  status: "pending" | "paid" | "shipped" | "completed" | "cancelled";
  paymentProvider: string;
  shippingAddress: string;
  createdAt: string;
}

export interface AdminBooking {
  id: string;
  ticketCode: string;
  workshopId: string;
  workshopTitle: string;
  workshopDate: string;
  attendeeName: string;
  attendeeEmail: string;
  seatCount: number;
  totalPrice: number;
  status: "confirmed" | "attended" | "cancelled";
  createdAt: string;
}

// Memory singleton for runtime operations
interface AdminDataStore {
  artworks: ArtworkDetail[];
  workshops: WorkshopItem[];
  orders: AdminOrder[];
  bookings: AdminBooking[];
}

const INITIAL_ORDERS: AdminOrder[] = [
  {
    id: "ord-901",
    orderNumber: "DD-2026-901",
    customerName: "Canan Altay",
    customerEmail: "canan.altay@artcurators.org",
    items: [
      {
        title: "selflove (1/1 Heykelsi Yüzük)",
        quantity: 1,
        price: 3200,
        imageUrl: "/artworks/744a7950cff34beaff3f06e308a540a0.jpg",
      },
    ],
    totalAmount: 3200,
    currency: "TRY",
    status: "paid",
    paymentProvider: "Stripe",
    shippingAddress: "Nişantaşı, Abdi İpekçi Cad. No: 24/6, Şişli / İstanbul",
    createdAt: "2026-09-15T14:22:00Z",
  },
  {
    id: "ord-902",
    orderNumber: "DD-2026-902",
    customerName: "Emre Tandoğan",
    customerEmail: "emre@tandoganarch.com",
    items: [
      {
        title: "erosion — monolithic vase",
        quantity: 1,
        price: 4800,
        imageUrl: "/artworks/44752606680a4cf18c44863741937f13.jpg",
      },
    ],
    totalAmount: 4800,
    currency: "TRY",
    status: "shipped",
    paymentProvider: "Stripe",
    shippingAddress: "Alsancak, Kıbrıs Şehitleri Cad. No: 82, Konak / İzmir",
    createdAt: "2026-09-14T11:05:00Z",
  },
  {
    id: "ord-903",
    orderNumber: "DD-2026-903",
    customerName: "Leyla Sencer",
    customerEmail: "leyla.sencer@designcollective.eu",
    items: [
      {
        title: "brut / molten cuff",
        quantity: 1,
        price: 2900,
        imageUrl: "/artworks/744a7950cff34beaff3f06e308a540a0.jpg",
      },
    ],
    totalAmount: 2900,
    currency: "TRY",
    status: "pending",
    paymentProvider: "Havale / EFT",
    shippingAddress: "Bebek Mah. Cevdetpaşa Cad. No: 12, Beşiktaş / İstanbul",
    createdAt: "2026-09-16T09:40:00Z",
  },
];

const INITIAL_BOOKINGS: AdminBooking[] = [
  {
    id: "bk-801",
    ticketCode: "DM-W26-8821",
    workshopId: "ws-1",
    workshopTitle: "Seramik Heykel & Raku Pişirimi",
    workshopDate: "2026-09-19 13:00",
    attendeeName: "Sırça Koleksiyoner",
    attendeeEmail: "sircaedebiyat@gmail.com",
    seatCount: 1,
    totalPrice: 4500,
    status: "confirmed",
    createdAt: "2026-09-12T10:00:00Z",
  },
  {
    id: "bk-802",
    ticketCode: "DM-W26-8822",
    workshopId: "ws-1",
    workshopTitle: "Seramik Heykel & Raku Pişirimi",
    workshopDate: "2026-09-19 13:00",
    attendeeName: "Deniz Acar",
    attendeeEmail: "deniz.acar@studio.com",
    seatCount: 2,
    totalPrice: 9000,
    status: "confirmed",
    createdAt: "2026-09-13T16:30:00Z",
  },
  {
    id: "bk-803",
    ticketCode: "DM-W26-8823",
    workshopId: "ws-2",
    workshopTitle: "Porselen Çamuru ile İleri Düzey Torna",
    workshopDate: "2026-09-23 10:00",
    attendeeName: "Mert Yılmaz",
    attendeeEmail: "mert.yilmaz@galerie.tr",
    seatCount: 1,
    totalPrice: 3800,
    status: "confirmed",
    createdAt: "2026-09-14T09:15:00Z",
  },
  {
    id: "bk-804",
    ticketCode: "DM-W26-8824",
    workshopId: "ws-3",
    workshopTitle: "Sır Kimyası & Doğal Kül Pigmentleri",
    workshopDate: "2026-09-28 14:00",
    attendeeName: "Ayşe Erdem",
    attendeeEmail: "ayse@erdemceramics.com",
    seatCount: 2,
    totalPrice: 6400,
    status: "confirmed",
    createdAt: "2026-09-15T18:00:00Z",
  },
];

declare global {
  var _adminStore: AdminDataStore | undefined;
}

export function getAdminStore(): AdminDataStore {
  if (!globalThis._adminStore) {
    globalThis._adminStore = {
      artworks: [...ARTWORKS_DATA],
      workshops: [...WORKSHOPS_DATA],
      orders: [...INITIAL_ORDERS],
      bookings: [...INITIAL_BOOKINGS],
    };
  }
  return globalThis._adminStore;
}

// Helper methods
export function getStoredArtworks(): ArtworkDetail[] {
  return getAdminStore().artworks;
}

export function saveArtworkToStore(artwork: ArtworkDetail): ArtworkDetail {
  const store = getAdminStore();
  const index = store.artworks.findIndex((a) => a.id === artwork.id);
  if (index >= 0) {
    store.artworks[index] = { ...artwork };
  } else {
    store.artworks.unshift({ ...artwork });
  }
  return artwork;
}

export function deleteArtworkFromStore(id: string): boolean {
  const store = getAdminStore();
  const initialLength = store.artworks.length;
  store.artworks = store.artworks.filter((a) => a.id !== id);
  return store.artworks.length < initialLength;
}

export function updateArtworkStockInStore(id: string, newStock: number): ArtworkDetail | null {
  const store = getAdminStore();
  const item = store.artworks.find((a) => a.id === id);
  if (item) {
    item.stock = Math.max(0, newStock);
    return item;
  }
  return null;
}

export function toggleArtworkFeaturedInStore(id: string): boolean {
  const store = getAdminStore();
  const item = store.artworks.find((a) => a.id === id);
  if (item) {
    item.isFeatured = !item.isFeatured;
    return item.isFeatured;
  }
  return false;
}

export function updateArtworkCoordsInStore(id: string, coords: { x: number; y: number }): boolean {
  const store = getAdminStore();
  const item = store.artworks.find((a) => a.id === id);
  if (item) {
    item.archiveCoords = coords;
    return true;
  }
  return false;
}

export function getStoredWorkshops(): WorkshopItem[] {
  return getAdminStore().workshops;
}

export function saveWorkshopToStore(workshop: WorkshopItem): WorkshopItem {
  const store = getAdminStore();
  const index = store.workshops.findIndex((w) => w.id === workshop.id);
  if (index >= 0) {
    store.workshops[index] = { ...workshop };
  } else {
    store.workshops.unshift({ ...workshop });
  }
  return workshop;
}

export function updateWorkshopEnrollmentInStore(id: string, delta: number): WorkshopItem | null {
  const store = getAdminStore();
  const item = store.workshops.find((w) => w.id === id);
  if (item) {
    item.enrolledCount = Math.max(0, Math.min(item.capacity, item.enrolledCount + delta));
    return item;
  }
  return null;
}

export function getStoredOrders(): AdminOrder[] {
  return getAdminStore().orders;
}

export function updateOrderStatusInStore(orderId: string, status: AdminOrder["status"]): boolean {
  const store = getAdminStore();
  const order = store.orders.find((o) => o.id === orderId);
  if (order) {
    order.status = status;
    return true;
  }
  return false;
}

export function getStoredBookings(): AdminBooking[] {
  return getAdminStore().bookings;
}

export function updateBookingStatusInStore(bookingId: string, status: AdminBooking["status"]): boolean {
  const store = getAdminStore();
  const booking = store.bookings.find((b) => b.id === bookingId);
  if (booking) {
    booking.status = status;
    return true;
  }
  return false;
}
