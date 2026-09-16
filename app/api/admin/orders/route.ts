import { NextRequest, NextResponse } from "next/server";
import {
  getStoredOrders,
  getStoredBookings,
  updateOrderStatusInStore,
  updateBookingStatusInStore,
} from "@/lib/admin-store";

export async function GET() {
  try {
    const orders = getStoredOrders();
    const bookings = getStoredBookings();
    return NextResponse.json({
      orders,
      bookings,
      totalOrders: orders.length,
      totalBookings: bookings.length,
    });
  } catch (error) {
    console.error("GET /api/admin/orders error:", error);
    return NextResponse.json({ error: "Siparişler alınamadı." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "ID ve Durum alanları zorunludur." }, { status: 400 });
    }

    if (type === "booking") {
      const ok = updateBookingStatusInStore(id, status);
      return NextResponse.json({ success: ok });
    } else {
      const ok = updateOrderStatusInStore(id, status);
      return NextResponse.json({ success: ok });
    }
  } catch (error) {
    console.error("PUT /api/admin/orders error:", error);
    return NextResponse.json({ error: "Durum güncellenemedi." }, { status: 500 });
  }
}
