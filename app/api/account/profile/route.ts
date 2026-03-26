import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/api";
import { requireApiUser, clearSession } from "@/lib/session";
import { normalizePhone } from "@/lib/auth";
import { ApiError, assertOptionalString, assertPhone, assertString } from "@/lib/validation";

async function hasRelatedRecords(userId: string) {
  const [movementCount, lossCount] = await Promise.all([
    prisma.stockMovement.count({ where: { userId } }),
    prisma.lossRecord.count({ where: { userId } })
  ]);
  return movementCount > 0 || lossCount > 0;
}

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
        throw new ApiError(409, "\u7528\u6237\u540d\u5df2\u5b58\u5728");
      }
      throw new ApiError(409, "\u624b\u673a\u53f7\u5df2\u88ab\u5176\u4ed6\u8d26\u6237\u7ed1\u5b9a");
    }

    const updated = await prisma.user.update({
      where: { id: session.id },
      data: { displayName, username, phone },
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
      userTypeLabel: updated.role === "ADMIN" ? "\u7ba1\u7406\u5458" : "\u6210\u5458"
    });
  } catch (error) {
    return fail(error);
  }
}

export async function DELETE() {
  try {
    const session = await requireApiUser();

    if (session.role === "ADMIN") {
      const adminCount = await prisma.user.count({ where: { role: "ADMIN" } });
      if (adminCount <= 1) {
        throw new ApiError(400, "\u81f3\u5c11\u4fdd\u7559\u4e00\u4e2a\u7ba1\u7406\u5458\u8d26\u6237");
      }
    }

    if (await hasRelatedRecords(session.id)) {
      throw new ApiError(400, "\u5f53\u524d\u8d26\u53f7\u5df2\u6709\u4e1a\u52a1\u8bb0\u5f55\uff0c\u6682\u4e0d\u652f\u6301\u76f4\u63a5\u6ce8\u9500");
    }

    await prisma.user.delete({ where: { id: session.id } });
    await clearSession();
    return ok({ deleted: true });
  } catch (error) {
    return fail(error);
  }
}