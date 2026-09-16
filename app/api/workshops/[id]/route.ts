import { NextRequest, NextResponse } from "next/server";
import { db, workshops } from "@/db";
import { eq } from "drizzle-orm";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ error: "Atölye kimliği belirtilmedi." }, { status: 400 });
    }

    // UUID veya slug kontrolü
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

    const workshop = await db.query.workshops.findFirst({
      where: isUuid ? eq(workshops.id, id) : eq(workshops.slug, id),
    });

    if (!workshop) {
      return NextResponse.json({ error: "Atölye bulunamadı." }, { status: 404 });
    }

    const remainingSpots = Math.max(0, workshop.capacity - workshop.enrolledCount);
    const isFull = remainingSpots <= 0;
    const fillPercentage = Math.min(100, Math.round((workshop.enrolledCount / workshop.capacity) * 100));

    return NextResponse.json({
      workshop: {
        ...workshop,
        remainingSpots,
        isFull,
        fillPercentage,
      },
    });
  } catch (error) {
    console.error("GET /api/workshops/[id] error:", error);
    return NextResponse.json({ error: "Sunucu hatası oluştu." }, { status: 500 });
  }
}
