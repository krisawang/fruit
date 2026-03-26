import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/api";
import { defaultMemberPermissions, normalizePhone } from "@/lib/auth";
import { hashPassword, verifyPassword } from "@/lib/password";
import { createSessionValue, sessionCookieName, sessionMaxAge } from "@/lib/session";
import { assertPassword, assertString, ApiError } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const identifier = assertString(body.identifier ?? body.username, "identifier");
    const password = assertPassword(body.password, "password");

    let user = await prisma.user.findFirst({ where: { OR: [{ username: identifier }, { phone: normalizePhone(identifier) }] } });

    const seedUsername = process.env.SEED_ADMIN_USERNAME || "admin";
    const seedPhone = process.env.SEED_ADMIN_PHONE ? normalizePhone(process.env.SEED_ADMIN_PHONE) : null;

    if (!user && (identifier === seedUsername || normalizePhone(identifier) === seedPhone)) {
      user = await prisma.user.create({
        data: {
          username: seedUsername,
          phone: seedPhone,
          displayName: process.env.SEED_ADMIN_DISPLAY_NAME || "\u4ed3\u5e93\u7ba1\u7406\u5458",
          passwordHash: hashPassword(process.env.SEED_ADMIN_PASSWORD || "admin123456"),
          role: "ADMIN"
        }
      });
    }

    if (!user || !verifyPassword(password, user.passwordHash)) {
      throw new ApiError(401, "\u8d26\u53f7\u6216\u5bc6\u7801\u9519\u8bef");
    }

    const cookieStore = await cookies();
    cookieStore.set({
      name: sessionCookieName,
      value: createSessionValue({ userId: user.id, username: user.username, displayName: user.displayName, role: user.role }),
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: sessionMaxAge,
      path: "/"
    });

    return ok({
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      phone: user.phone,
      role: user.role,
      permissions: user.role === "ADMIN" ? undefined : user.permissions ?? defaultMemberPermissions
    });
  } catch (error) {
    return fail(error);
  }
}
