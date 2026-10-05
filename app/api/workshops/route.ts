import { NextResponse } from "next/server";
import { getStoredWorkshops } from "@/lib/admin-store";

export async function GET() {
  try {
    const items = getStoredWorkshops();

    const formatted = items.map((w) => {
      const remainingSpots = Math.max(0, w.capacity - w.enrolledCount);
      const isFull = remainingSpots <= 0;
      const fillPercentage = Math.min(100, Math.round((w.enrolledCount / w.capacity) * 100));

      return {
        ...w,
        remainingSpots,
        isFull,
        fillPercentage,
      };
    });

    return NextResponse.json({
      workshops: formatted,
      total: formatted.length,
    });
  } catch (error) {
    console.error("GET /api/workshops error:", error);
    return NextResponse.json(
      { error: "Atölye listesi alınırken bir hata oluştu." },
      { status: 500 }
    );
  }
}
