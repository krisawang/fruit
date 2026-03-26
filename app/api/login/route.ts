import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/api";
import { hashPassword, verifyPassword } from "@/lib/password";
import { createSessionValue, sessionCookieName, sessionMaxAge } from "@/lib/session";
import { assertString, ApiError } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const username = assertString(body.username, "username");
    const password = assertString(body.password, "password");

    let user = await prisma.user.findUnique({ where: { username } });

    if (!user && username === (process.env.SEED_ADMIN_USERNAME || "admin")) {
      user = await prisma.user.create({
        data: {
          username,
          displayName: process.env.SEED_ADMIN_DISPLAY_NAME || "仓库管理员",
          passwordHash: hashPassword(process.env.SEED_ADMIN_PASSWORD || "admin123456"),
          role: "ADMIN"
        }
      });
    }

    if (!user || !verifyPassword(password, user.passwordHash)) {
      throw new ApiError(401, "Invalid username or password");
    }

    const cookieStore = await cookies();
    cookieStore.set({
      name: sessionCookieName,
      value: createSessionValue({
        userId: user.id,
        username: user.username,
        displayName: user.displayName,
        role: user.role
      }),
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
      role: user.role
    });
  } catch (error) {
    return fail(error);
  }
}
