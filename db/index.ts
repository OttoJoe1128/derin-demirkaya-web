import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Global cache to prevent multiple client instances during Next.js App Router hot reloading
declare global {
  var _postgresClient: postgres.Sql | undefined;
}

let dbInstance: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDb() {
  if (dbInstance) {
    return dbInstance;
  }

  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error(
      "DATABASE_URL ortam değişkeni bulunamadı. Lütfen .env dosyanıza Supabase veya PostgreSQL bağlantı adresinizi ekleyin."
    );
  }

  // Supabase pooler / standard PostgreSQL connection
  const client =
    globalThis._postgresClient ??
    postgres(connectionString, {
      prepare: false, // Recommended for Supabase transaction pooler (port 6543)
      ssl: process.env.NODE_ENV === "production" ? "require" : undefined,
    });

  if (process.env.NODE_ENV !== "production") {
    globalThis._postgresClient = client;
  }

  dbInstance = drizzle(client, { schema });
  return dbInstance;
}

// Lazy proxy so you can import `db` directly: import { db } from "@/db"
export const db = new Proxy({} as ReturnType<typeof drizzle<typeof schema>>, {
  get(_target, prop) {
    const realDb = getDb();
    const val = (realDb as unknown as Record<string, unknown>)[prop as string];
    if (typeof val === "function") {
      return (val as (...args: unknown[]) => unknown).bind(realDb);
    }
    return val;
  },
});

export * from "./schema";
