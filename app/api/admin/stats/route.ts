import { NextResponse } from "next/server";
import {
  getStoredArtworks,
  getStoredWorkshops,
  getStoredOrders,
  getStoredBookings,
} from "@/lib/admin-store";
import { db, products } from "@/db";

export async function GET() {
  try {
    let dbConnected = false;

    // Check if real DB connection works
    try {
      if (process.env.DATABASE_URL) {
        // Simple ping test
        await db.select().from(products).limit(1);
        dbConnected = true;
      }
    } catch (dbErr) {
      console.warn("PostgreSQL not active, using unified artist store:", dbErr);
      dbConnected = false;
    }

    // Use memory store which has full data
    const artworks = getStoredArtworks();
    const workshopsList = getStoredWorkshops();
    const ordersList = getStoredOrders();
    const bookingsList = getStoredBookings();

    // 1. Financial stats
    const totalOrderRevenue = ordersList
      .filter((o) => o.status === "paid" || o.status === "shipped" || o.status === "completed")
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const totalWorkshopRevenue = bookingsList
      .filter((b) => b.status === "confirmed" || b.status === "attended")
      .reduce((sum, b) => sum + b.totalPrice, 0);

    const totalRevenue = totalOrderRevenue + totalWorkshopRevenue;

    // 2. Artwork stats
    const totalArtworks = artworks.length;
    const uniquePiecesCount = artworks.filter((a) => a.isUniquePiece).length;
    const lowStockArtworks = artworks.filter((a) => a.stock <= 1);
    const featuredArtworks = artworks.filter((a) => a.isFeatured);

    // 3. Workshop capacity and fill rate
    const totalCapacity = workshopsList.reduce((sum, w) => sum + w.capacity, 0);
    const totalEnrolled = workshopsList.reduce((sum, w) => sum + w.enrolledCount, 0);
    const averageFillRate = totalCapacity > 0 ? Math.round((totalEnrolled / totalCapacity) * 100) : 0;

    // 4. Formatted workshops with real-time percentages
    const workshopAnalytics = workshopsList.map((w) => {
      const remaining = Math.max(0, w.capacity - w.enrolledCount);
      const percentage = Math.round((w.enrolledCount / w.capacity) * 100);
      const estRevenue = w.enrolledCount * w.rawPrice;
      return {
        id: w.id,
        title: w.title,
        instructor: w.instructor,
        dateOffsetDays: w.dateOffsetDays,
        hour: w.hour,
        capacity: w.capacity,
        enrolledCount: w.enrolledCount,
        remaining,
        percentage,
        estRevenue,
        price: w.price,
      };
    });

    // 5. Recent orders and bookings
    const recentOrders = [...ordersList].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const recentBookings = [...bookingsList].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({
      dbConnected,
      stats: {
        totalRevenue,
        totalOrderRevenue,
        totalWorkshopRevenue,
        totalArtworks,
        uniquePiecesCount,
        lowStockCount: lowStockArtworks.length,
        featuredCount: featuredArtworks.length,
        averageFillRate,
        totalCapacity,
        totalEnrolled,
      },
      lowStockArtworks: lowStockArtworks.map((a) => ({
        id: a.id,
        title: a.title,
        stock: a.stock,
        price: a.price,
        isUniquePiece: a.isUniquePiece,
        images: a.images,
      })),
      workshopAnalytics,
      recentOrders,
      recentBookings,
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json(
      { error: "İstatistikler derlenirken hata oluştu." },
      { status: 500 }
    );
  }
}
