import { NextRequest, NextResponse } from "next/server";
import { db, customers } from "@/db";
import { eq } from "drizzle-orm";
import { comparePassword, createAuthToken, setAuthCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "E-posta ve şifre alanları zorunludur." },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    // Kullanıcıyı veritabanında ara
    const user = await db.query.customers.findFirst({
      where: eq(customers.email, normalizedEmail),
    });

    if (!user || !user.passwordHash) {
      return NextResponse.json(
        { error: "E-posta veya şifre hatalı." },
        { status: 401 }
      );
    }

    // Şifre kontrolü
    const isPasswordValid = await comparePassword(String(password), user.passwordHash);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "E-posta veya şifre hatalı." },
        { status: 401 }
      );
    }

    // JWT token üretimi
    const token = await createAuthToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
    });

    const response = NextResponse.json(
      {
        message: "Giriş başarılı.",
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          avatarUrl: user.avatarUrl,
        },
      },
      { status: 200 }
    );

    // Güvenli HttpOnly Cookie yerleştir
    setAuthCookie(response, token);
    return response;
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { error: "Giriş yapılırken bir sunucu hatası meydana geldi." },
      { status: 500 }
    );
  }
}
