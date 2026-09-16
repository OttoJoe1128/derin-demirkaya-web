import {
  pgTable,
  uuid,
  varchar,
  text,
  numeric,
  integer,
  boolean,
  timestamp,
  jsonb,
  pgEnum,
  primaryKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ==========================================
// ENUMS (PostgreSQL Types)
// ==========================================
export const userRoleEnum = pgEnum("user_role", ["customer", "artist", "admin"]);
export const productStatusEnum = pgEnum("product_status", ["draft", "active", "archived"]);
export const workshopStatusEnum = pgEnum("workshop_status", ["upcoming", "ongoing", "completed", "cancelled"]);
export const orderStatusEnum = pgEnum("order_status", ["pending", "paid", "shipped", "completed", "cancelled"]);
export const bookingStatusEnum = pgEnum("booking_status", ["confirmed", "attended", "cancelled"]);

// ==========================================
// 1. CUSTOMERS / USERS (Müşteriler & Sanatçılar)
// ==========================================
export const customers = pgTable("customers", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  role: userRoleEnum("role").default("customer").notNull(),
  avatarUrl: text("avatar_url"),
  address: jsonb("address"), // { addressLine, city, state, postalCode, country }
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ==========================================
// 2. CATEGORIES (Koleksiyonlar / Kategoriler)
// ==========================================
export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 150 }).notNull(),
  slug: varchar("slug", { length: 150 }).notNull().unique(),
  description: text("description"),
  imageUrl: text("image_url"),
  displayOrder: integer("display_order").default(0).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ==========================================
// 3. PRODUCTS (Eserler / Ürünler)
// ==========================================
export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  compareAtPrice: numeric("compare_at_price", { precision: 10, scale: 2 }),
  stock: integer("stock").default(0).notNull(),
  sku: varchar("sku", { length: 100 }).unique(),
  status: productStatusEnum("status").default("active").notNull(),
  images: jsonb("images").$type<string[]>().default([]),
  dimensions: jsonb("dimensions"), // { width, height, depth, unit, weight }
  isFeatured: boolean("is_featured").default(false).notNull(), // Editoryal Brutalizm vitrini için
  archiveCoords: jsonb("archive_coords").$type<{ x: number; y: number }>(), // Faz 2.5 / 4.4 Tuval koordinatları
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ==========================================
// MANY-TO-MANY: PRODUCT <-> CATEGORIES
// ==========================================
export const productCategories = pgTable(
  "product_categories",
  {
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.productId, t.categoryId] })]
);

// ==========================================
// 4. WORKSHOPS (Atölyeler & Etkinlikler)
// ==========================================
export const workshops = pgTable("workshops", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  instructor: varchar("instructor", { length: 255 }).notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  date: timestamp("date", { withTimezone: true }).notNull(),
  durationMinutes: integer("duration_minutes").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  capacity: integer("capacity").notNull(),
  enrolledCount: integer("enrolled_count").default(0).notNull(),
  status: workshopStatusEnum("status").default("upcoming").notNull(),
  imageUrl: text("image_url"),
  materialsIncluded: text("materials_included"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ==========================================
// 5. ORDERS (Siparişler)
// ==========================================
export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderNumber: varchar("order_number", { length: 50 }).notNull().unique(),
  customerId: uuid("customer_id").references(() => customers.id, { onDelete: "set null" }),
  status: orderStatusEnum("status").default("pending").notNull(),
  totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("TRY").notNull(),
  paymentProvider: varchar("payment_provider", { length: 50 }), // stripe, iyzico
  paymentId: varchar("payment_id", { length: 255 }),
  shippingAddress: jsonb("shipping_address"),
  billingAddress: jsonb("billing_address"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ==========================================
// 6. ORDER ITEMS (Sipariş Kalemleri)
// ==========================================
export const orderItems = pgTable("order_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: uuid("product_id").references(() => products.id, { onDelete: "set null" }),
  quantity: integer("quantity").default(1).notNull(),
  unitPrice: numeric("unit_price", { precision: 10, scale: 2 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(), // Fiyat/isim değişirse sipariş anı görüntüsü korunur
});

// ==========================================
// 7. WORKSHOP BOOKINGS (Atölye Rezervasyonları & Biletleri)
// ==========================================
export const workshopBookings = pgTable("workshop_bookings", {
  id: uuid("id").primaryKey().defaultRandom(),
  workshopId: uuid("workshop_id")
    .notNull()
    .references(() => workshops.id, { onDelete: "cascade" }),
  customerId: uuid("customer_id").references(() => customers.id, { onDelete: "set null" }),
  orderId: uuid("order_id").references(() => orders.id, { onDelete: "set null" }),
  ticketCode: varchar("ticket_code", { length: 100 }).notNull().unique(), // QR kod içeriği için
  status: bookingStatusEnum("status").default("confirmed").notNull(),
  attendeeName: varchar("attendee_name", { length: 255 }).notNull(),
  attendeeEmail: varchar("attendee_email", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ==========================================
// RELATIONS (Drizzle Type-Safe İlişkileri)
// ==========================================

export const customersRelations = relations(customers, ({ many }) => ({
  orders: many(orders),
  workshopBookings: many(workshopBookings),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  productCategories: many(productCategories),
}));

export const productsRelations = relations(products, ({ many }) => ({
  productCategories: many(productCategories),
  orderItems: many(orderItems),
}));

export const productCategoriesRelations = relations(productCategories, ({ one }) => ({
  product: one(products, {
    fields: [productCategories.productId],
    references: [products.id],
  }),
  category: one(categories, {
    fields: [productCategories.categoryId],
    references: [categories.id],
  }),
}));

export const workshopsRelations = relations(workshops, ({ many }) => ({
  bookings: many(workshopBookings),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  customer: one(customers, {
    fields: [orders.customerId],
    references: [customers.id],
  }),
  items: many(orderItems),
  workshopBookings: many(workshopBookings),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

export const workshopBookingsRelations = relations(workshopBookings, ({ one }) => ({
  workshop: one(workshops, {
    fields: [workshopBookings.workshopId],
    references: [workshops.id],
  }),
  customer: one(customers, {
    fields: [workshopBookings.customerId],
    references: [customers.id],
  }),
  order: one(orders, {
    fields: [workshopBookings.orderId],
    references: [orders.id],
  }),
}));
