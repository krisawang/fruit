import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/api";
import { requireApiUser } from "@/lib/session";
import { normalizePhone } from "@/lib/auth";
import { ApiError, assertOptionalString, assertPhone, assertString } from "@/lib/validation";

export async function GET() {
  try {
    const user = await requireApiUser();
    return ok(user);
  } catch (error) {
    return fail(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await requireApiUser();
    const body = await request.json();

    const displayName = assertString(body.displayName, "displayName");
    const username = assertString(body.username, "username");
    const rawPhone = assertOptionalString(body.phone);
    const phone = rawPhone ? normalizePhone(assertPhone(rawPhone, "phone")) : null;

    const conflict = await prisma.user.findFirst({
      where: {
        id: { not: session.id },
        OR: [{ username }, ...(phone ? [{ phone }] : [])]
      },
      select: { id: true, username: true, phone: true }
    });

    if (conflict) {
      if (conflict.username === username) {
        throw new ApiError(409, "用户名已存在");
      }
      throw new ApiError(409, "手机号已被其他账户绑定");
    }

    const updated = await prisma.user.update({
      where: { id: session.id },
      data: {
        displayName,
        username,
        phone
      },
      select: {
        id: true,
        username: true,
        phone: true,
        displayName: true,
        role: true,
        permissions: true
      }
    });

    return ok({
      id: updated.id,
      username: updated.username,
      phone: updated.phone,
      displayName: updated.displayName,
      role: updated.role,
      userTypeLabel: updated.role === "ADMIN" ? "管理员" : "成员"
    });
  } catch (error) {
    return fail(error);
  }
}