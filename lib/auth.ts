import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

export type UserRole = "customer" | "artist" | "admin";

export interface AuthTokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  fullName: string;
}

const AUTH_COOKIE_NAME = "auth_token";
const TOKEN_EXPIRY = "7d"; // 7 gün geçerlilik

function getJwtSecretKey(): Uint8Array {
  const secret = process.env.JWT_SECRET || "derin-demirkaya-production-secret-token-key-2026";
  return new TextEncoder().encode(secret);
}

// ==========================================
// 1. ŞİFRE HASHLEME & KARŞILAŞTIRMA
// ==========================================
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// ==========================================
// 2. JWT TOKEN ÜRETİMİ & DOĞRULAMA (jose)
// ==========================================
export async function createAuthToken(payload: AuthTokenPayload): Promise<string> {
  const secretKey = getJwtSecretKey();
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(secretKey);
}

export async function verifyAuthToken(token: string): Promise<AuthTokenPayload | null> {
  try {
    const secretKey = getJwtSecretKey();
    const { payload } = await jwtVerify(token, secretKey);
    return {
      userId: payload.userId as string,
      email: payload.email as string,
      role: payload.role as UserRole,
      fullName: payload.fullName as string,
    };
  } catch {
    return null;
  }
}

// ==========================================
// 3. HTTPONLY COOKIE YÖNETİMİ
// ==========================================
export function setAuthCookie(response: NextResponse, token: string): void {
  const isProduction = process.env.NODE_ENV === "production";
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: token,
    httpOnly: true, // XSS ataklarına karşı JS erişimini engeller
    secure: isProduction, // Yalnızca HTTPS üzerinden aktarılır (üretimde)
    sameSite: "lax", // CSRF koruması
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 gün (saniye cinsinden)
  });
}

export function clearAuthCookie(response: NextResponse): void {
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

// ==========================================
// 4. MEVCUT KULLANICIYI VE ROLÜNÜ ÇÖZME (RBAC)
// ==========================================
export async function getCurrentUser(req?: NextRequest | Request): Promise<AuthTokenPayload | null> {
  let token: string | undefined;

  if (req && "cookies" in req) {
    // NextRequest içinden okuma
    const nextReq = req as NextRequest;
    token = nextReq.cookies.get(AUTH_COOKIE_NAME)?.value;
  }

  if (!token) {
    // next/headers cookies() üzerinden okuma (Server Components & Server Actions)
    try {
      const cookieStore = await cookies();
      token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    } catch {
      // API context dışında veya statik render esnasında
      token = undefined;
    }
  }

  if (!token) return null;
  return verifyAuthToken(token);
}

// Rol Kontrolü (RBAC Guard)
export function hasRequiredRole(userRole: UserRole, allowedRoles: UserRole[]): boolean {
  return allowedRoles.includes(userRole);
}

/**
 * API Rotaları için tek satırda RBAC yetkilendirmesi
 * Örnek kullanım:
 * const auth = await authorizeRoute(req, ["admin", "artist"]);
 * if (auth.errorResponse) return auth.errorResponse;
 * const { user } = auth;
 */
export async function authorizeRoute(
  req: NextRequest,
  allowedRoles?: UserRole[]
): Promise<
  | { user: AuthTokenPayload; errorResponse: null }
  | { user: null; errorResponse: NextResponse }
> {
  const user = await getCurrentUser(req);

  if (!user) {
    return {
      user: null,
      errorResponse: NextResponse.json(
        { error: "Bu işlem için giriş yapmanız gerekmektedir." },
        { status: 401 }
      ),
    };
  }

  if (allowedRoles && allowedRoles.length > 0 && !hasRequiredRole(user.role, allowedRoles)) {
    return {
      user: null,
      errorResponse: NextResponse.json(
        { error: "Bu alana erişmek için gerekli yetkiye sahip değilsiniz." },
        { status: 403 }
      ),
    };
  }

  return { user, errorResponse: null };
}

