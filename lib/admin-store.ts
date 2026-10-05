import fs from "fs";
import path from "path";
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

const STORE_FILE_PATH = path.join(process.cwd(), "data", "studio-store.json");

function loadPersistedStore(): Partial<AdminDataStore> | null {
  try {
    if (typeof window === "undefined" && fs.existsSync(STORE_FILE_PATH)) {
      const raw = fs.readFileSync(STORE_FILE_PATH, "utf8");
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn("Failed to load persisted studio store from file:", err);
  }
  return null;
}

function persistStore(store: AdminDataStore): void {
  try {
    if (typeof window === "undefined") {
      const dir = path.dirname(STORE_FILE_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(STORE_FILE_PATH, JSON.stringify(store, null, 2), "utf8");
    }
  } catch (err) {
    console.warn("Failed to persist studio store to file:", err);
  }
}

declare global {
  var _adminStore: AdminDataStore | undefined;
}

export function getAdminStore(): AdminDataStore {
  if (!globalThis._adminStore) {
    const saved = loadPersistedStore();
    globalThis._adminStore = {
      artworks: saved?.artworks && Array.isArray(saved.artworks) && saved.artworks.length > 0 ? saved.artworks : [...ARTWORKS_DATA],
      workshops: saved?.workshops && Array.isArray(saved.workshops) ? saved.workshops : [...WORKSHOPS_DATA],
      orders: saved?.orders && Array.isArray(saved.orders) ? saved.orders : [...INITIAL_ORDERS],
      bookings: saved?.bookings && Array.isArray(saved.bookings) ? saved.bookings : [...INITIAL_BOOKINGS],
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
  persistStore(store);
  return artwork;
}

export function deleteArtworkFromStore(id: string): boolean {
  const store = getAdminStore();
  const initialLength = store.artworks.length;
  store.artworks = store.artworks.filter((a) => a.id !== id);
  const wasDeleted = store.artworks.length < initialLength;
  if (wasDeleted) {
    persistStore(store);
  }
  return wasDeleted;
}

export function updateArtworkStockInStore(id: string, newStock: number): ArtworkDetail | null {
  const store = getAdminStore();
  const item = store.artworks.find((a) => a.id === id);
  if (item) {
    item.stock = Math.max(0, newStock);
    persistStore(store);
    return item;
  }
  return null;
}

export function toggleArtworkFeaturedInStore(id: string): boolean {
  const store = getAdminStore();
  const item = store.artworks.find((a) => a.id === id);
  if (item) {
    item.isFeatured = !item.isFeatured;
    persistStore(store);
    return item.isFeatured;
  }
  return false;
}

export function updateArtworkCoordsInStore(id: string, coords: { x: number; y: number }): boolean {
  const store = getAdminStore();
  const item = store.artworks.find((a) => a.id === id);
  if (item) {
    item.archiveCoords = coords;
    persistStore(store);
    return true;
  }
  return false;
}

export function batchUpdateArtworkCoordsInStore(items: { id: string; coords: { x: number; y: number } }[]): boolean {
  const store = getAdminStore();
  let modified = false;
  items.forEach(({ id, coords }) => {
    const item = store.artworks.find((a) => a.id === id);
    if (item) {
      item.archiveCoords = coords;
      modified = true;
    }
  });
  if (modified) {
    persistStore(store);
  }
  return modified;
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
  persistStore(store);
  return workshop;
}

export function updateWorkshopEnrollmentInStore(id: string, delta: number): WorkshopItem | null {
  const store = getAdminStore();
  const item = store.workshops.find((w) => w.id === id);
  if (item) {
    item.enrolledCount = Math.max(0, Math.min(item.capacity, item.enrolledCount + delta));
    persistStore(store);
    return item;
  }
  return null;
}

export function deleteWorkshopFromStore(id: string): boolean {
  const store = getAdminStore();
  const initialLength = store.workshops.length;
  store.workshops = store.workshops.filter((w) => w.id !== id);
  const wasDeleted = store.workshops.length < initialLength;
  if (wasDeleted) {
    persistStore(store);
  }
  return wasDeleted;
}

export function getStoredOrders(): AdminOrder[] {
  return getAdminStore().orders;
}

export function updateOrderStatusInStore(orderId: string, status: AdminOrder["status"]): boolean {
  const store = getAdminStore();
  const order = store.orders.find((o) => o.id === orderId);
  if (order) {
    order.status = status;
    persistStore(store);
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
    persistStore(store);
    return true;
  }
  return false;
}
