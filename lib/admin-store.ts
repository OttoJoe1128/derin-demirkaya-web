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

const INITIAL_ORDERS: AdminOrder[] = [];

const INITIAL_BOOKINGS: AdminBooking[] = [];

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

export function deleteWorkshopFromStore(id: string): boolean {
  const store = getAdminStore();
  const initialLength = store.workshops.length;
  store.workshops = store.workshops.filter((w) => w.id !== id);
  return store.workshops.length < initialLength;
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
