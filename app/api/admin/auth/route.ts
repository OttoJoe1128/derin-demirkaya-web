import { NextRequest, NextResponse } from "next/server";
import { SignJWT, jwtVerify } from "jose";
import { comparePassword } from "@/lib/auth";
import { db, customers } from "@/db";
import { eq } from "drizzle-orm";

const ADMIN_COOKIE_NAME = "admin_session";
const TOKEN_EXPIRY = "7d";

function getJwtSecretKey(): Uint8Array {
  const secret = process.env.JWT_SECRET || "derin-demirkaya-production-secret-token-key-2026";
  return new TextEncoder().encode(secret);
}

// Master Studio Sabit Şifresi
const VALID_PASSWORDS = [
  process.env.ADMIN_PASSWORD,
  "nonvalue2026!",
].filter(Boolean) as string[];

/**
 * GET /api/admin/auth
 * Mevcut oturumun geçerli bir Studio Admin yetkisi olup olmadığını doğrular
 */
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value || req.cookies.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const secretKey = getJwtSecretKey();
    const { payload } = await jwtVerify(token, secretKey);

    if (payload.role !== "admin" && payload.role !== "artist") {
      return NextResponse.json(
        { authenticated: false, error: "Yetkisiz erişim seviyesi." },
        { status: 403 }
      );
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        userId: payload.userId,
        email: payload.email,
        fullName: payload.fullName,
        role: payload.role,
      },
    });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}

/**
 * POST /api/admin/auth
 * Stüdyo Master Girişi (Şifre veya E-posta + Şifre ile)
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { password, email } = body;

    if (!password) {
      return NextResponse.json(
        { error: "Stüdyo erişim şifresi gereklidir." },
        { status: 400 }
      );
    }

    const cleanPassword = String(password).trim();
    let isAuthorized = false;
    let adminProfile: {
      userId: string;
      email: string;
      fullName: string;
      role: "admin" | "artist";
    } = {
      userId: "usr-admin-derin",
      email: email ? String(email).trim().toLowerCase() : "derinbusedemirkaya@gmail.com",
      fullName: "Derin Buse Demirkaya",
      role: "admin",
    };

    // 1. Stüdyo Anahtar / Passphrase Kontrolü
    if (VALID_PASSWORDS.includes(cleanPassword)) {
      isAuthorized = true;
    } else {
      // 2. Veritabanı varsa DB üzerindeki admin kullanıcısını kontrol et
      try {
        if (process.env.DATABASE_URL && email) {
          const user = await db.query.customers.findFirst({
            where: eq(customers.email, String(email).trim().toLowerCase()),
          });

          if (user && user.passwordHash && (user.role === "admin" || user.role === "artist")) {
            const matches = await comparePassword(cleanPassword, user.passwordHash);
            if (matches) {
              isAuthorized = true;
              adminProfile = {
                userId: user.id,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
              };
            }
          }
        }
      } catch (dbErr) {
        console.warn("DB auth check failed:", dbErr);
      }
    }

    if (!isAuthorized) {
      return NextResponse.json(
        { error: "Geçersiz stüdyo parolası. Erişim reddedildi." },
        { status: 401 }
      );
    }

    // JWT İmzala (7 gün geçerli)
    const secretKey = getJwtSecretKey();
    const token = await new SignJWT({ ...adminProfile })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(TOKEN_EXPIRY)
      .sign(secretKey);

    const isProduction = process.env.NODE_ENV === "production";
    const response = NextResponse.json({
      success: true,
      message: "Stüdyo yetkilendirmesi onaylandı. Hoş geldiniz.",
      user: adminProfile,
    });

    // Hem admin_session hem de auth_token çerezlerini ayarla
    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    response.cookies.set({
      name: "auth_token",
      value: token,
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error("Admin Login Error:", error);
    return NextResponse.json(
      { error: "Giriş işlemi esnasında bir hata oluştu." },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/auth
 * Güvenli Çıkış (Admin oturum çerezlerini temizler)
 */
export async function DELETE() {
  const isProduction = process.env.NODE_ENV === "production";
  const response = NextResponse.json({
    success: true,
    message: "Stüdyo oturumu güvenli şekilde sonlandırıldı.",
  });

  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  response.cookies.set({
    name: "auth_token",
    value: "",
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}
