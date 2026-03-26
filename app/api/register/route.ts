import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/api";
import { defaultMemberPermissions, normalizePhone } from "@/lib/auth";
import { hashPassword } from "@/lib/password";
import { createSessionValue, sessionCookieName, sessionMaxAge } from "@/lib/session";
import { assertPassword, assertPhone, assertString, ApiError } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const username = assertString(body.username, "username");
    const displayName = assertString(body.displayName, "displayName");
    const phone = assertPhone(body.phone, "phone");
    const password = assertPassword(body.password, "password");

    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { phone }]
      }
    });

    if (existing) {
      throw new ApiError(409, existing.username === username ? "�û����Ѵ���" : "�ֻ�����ע��");
    }

    const user = await prisma.user.create({
      data: {
        username,
        phone: normalizePhone(phone),
        displayName,
        passwordHash: hashPassword(password),
        role: "CLERK",
        permissions: defaultMemberPermissions
      }
    });

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
      phone: user.phone,
      role: user.role
    }, { status: 201 });
  } catch (error) {
    return fail(error);
  }
}
