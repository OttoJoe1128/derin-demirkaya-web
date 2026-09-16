import { NextRequest, NextResponse } from "next/server";
import { db, customers } from "@/db";
import { eq } from "drizzle-orm";
import { hashPassword, createAuthToken, setAuthCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, email, password, phone } = body;

    // Temel alan validasyonu
    if (!fullName || typeof fullName !== "string" || fullName.trim().length < 2) {
      return NextResponse.json(
        { error: "Geçerli bir ad soyad giriniz (en az 2 karakter)." },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "Geçerli bir e-posta adresi giriniz." },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string" || password.length < 6) {
      return NextResponse.json(
        { error: "Şifre en az 6 karakter olmalıdır." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // E-posta benzersizlik kontrolü
    const existingUser = await db.query.customers.findFirst({
      where: eq(customers.email, normalizedEmail),
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Bu e-posta adresi ile zaten kayıtlı bir hesap bulunmaktadır." },
        { status: 409 }
      );
    }

    // Şifreyi bcrypt ile hashle
    const passwordHash = await hashPassword(password);

    // Yeni kullanıcıyı kaydet (Varsayılan rol: 'customer')
    const [newUser] = await db
      .insert(customers)
      .values({
        fullName: fullName.trim(),
        email: normalizedEmail,
        passwordHash,
        phone: phone ? String(phone).trim() : null,
        role: "customer",
      })
      .returning({
        id: customers.id,
        email: customers.email,
        fullName: customers.fullName,
        role: customers.role,
        createdAt: customers.createdAt,
      });

    // JWT token üret ve HttpOnly Cookie olarak ayarla
    const token = await createAuthToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
      fullName: newUser.fullName,
    });

    const response = NextResponse.json(
      {
        message: "Kayıt işlemi başarıyla tamamlandı.",
        user: {
          id: newUser.id,
          email: newUser.email,
          fullName: newUser.fullName,
          role: newUser.role,
        },
      },
      { status: 201 }
    );

    setAuthCookie(response, token);
    return response;
  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json(
      { error: "Kayıt işlemi sırasında bir sunucu hatası oluştu." },
      { status: 500 }
    );
  }
}
