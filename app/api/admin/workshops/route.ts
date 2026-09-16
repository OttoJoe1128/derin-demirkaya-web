import { NextRequest, NextResponse } from "next/server";
import {
  getStoredWorkshops,
  saveWorkshopToStore,
  updateWorkshopEnrollmentInStore,
} from "@/lib/admin-store";
import type { WorkshopItem } from "@/lib/workshops-data";

export async function GET() {
  try {
    const list = getStoredWorkshops();
    return NextResponse.json({
      workshops: list,
      total: list.length,
    });
  } catch (error) {
    console.error("GET /api/admin/workshops error:", error);
    return NextResponse.json({ error: "Atölyeler alınamadı." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.title) {
      return NextResponse.json({ error: "Atölye başlığı zorunludur." }, { status: 400 });
    }

    const newId = body.id || `ws-${Date.now()}`;
    const slug = body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const rawPrice = Number(body.rawPrice || body.price?.toString().replace(/[^0-9]/g, "") || 3500);

    const newWorkshop: WorkshopItem = {
      id: newId,
      slug,
      title: body.title,
      titleEn: body.titleEn || body.title,
      description: body.description || "",
      descriptionEn: body.descriptionEn || "",
      category: body.category || "casting",
      categoryTitle: body.categoryTitle || "Atölye",
      categoryTitleEn: body.categoryTitleEn || "Workshop",
      instructor: body.instructor || "Derin Buse Demirkaya",
      location: body.location || "Galata Açık Hava Heykel Stüdyosu, İstanbul",
      locationEn: body.locationEn || "Galata Open-Air Studio, Istanbul",
      durationMinutes: Number(body.durationMinutes || 180),
      price: body.price || `₺${rawPrice.toLocaleString("tr-TR")}`,
      rawPrice,
      capacity: Number(body.capacity || 8),
      enrolledCount: Number(body.enrolledCount || 0),
      dateOffsetDays: Number(body.dateOffsetDays || 7),
      hour: Number(body.hour || 13),
      imageUrl: body.imageUrl || "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1200&q=80",
      materialsIncluded: body.materialsIncluded || "Tüm zanaat malzemeleri ve fırınlama dahildir.",
      materialsIncludedEn: body.materialsIncludedEn || "All studio materials and kiln firings included.",
    };

    const saved = saveWorkshopToStore(newWorkshop);
    return NextResponse.json({ success: true, workshop: saved });
  } catch (error) {
    console.error("POST /api/admin/workshops error:", error);
    return NextResponse.json({ error: "Atölye oluşturulamadı." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, action, delta } = body;

    if (!id) {
      return NextResponse.json({ error: "Atölye ID gereklidir." }, { status: 400 });
    }

    if (action === "update-enrollment" && typeof delta === "number") {
      const updated = updateWorkshopEnrollmentInStore(id, delta);
      return NextResponse.json({ success: true, workshop: updated });
    }

    const saved = saveWorkshopToStore(body);
    return NextResponse.json({ success: true, workshop: saved });
  } catch (error) {
    console.error("PUT /api/admin/workshops error:", error);
    return NextResponse.json({ error: "Atölye güncellenemedi." }, { status: 500 });
  }
}
