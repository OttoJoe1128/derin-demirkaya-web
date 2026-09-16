import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db, customers } from "@/db";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const authSession = await getCurrentUser(req);

    if (!authSession) {
      return NextResponse.json(
        { error: "Oturum bulunamadı veya süresi dolmuş." },
        { status: 401 }
      );
    }

    // Veritabanından güncel kullanıcı bilgilerini çek (şifre hash hariç)
    const user = await db.query.customers.findFirst({
      where: eq(customers.id, authSession.userId),
      columns: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        avatarUrl: true,
        phone: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Kullanıcı kaydı bulunamadı." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        user,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Auth Me Error:", error);
    return NextResponse.json(
      { error: "Kullanıcı bilgisi alınırken sunucu hatası oluştu." },
      { status: 500 }
    );
  }
}
