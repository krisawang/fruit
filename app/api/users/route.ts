import { UserRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/api";
import { sanitizePermissionsInput } from "@/lib/auth";
import { requireApiUser } from "@/lib/session";
import { ApiError, assertEnumValue, assertOptionalString, assertString } from "@/lib/validation";

const roleValues = [UserRole.ADMIN, UserRole.MANAGER, UserRole.CLERK] as const;

async function hasRelatedRecords(userId: string) {
  const [movementCount, lossCount] = await Promise.all([
    prisma.stockMovement.count({ where: { userId } }),
    prisma.lossRecord.count({ where: { userId } })
  ]);
  return movementCount > 0 || lossCount > 0;
}

export async function GET() {
  try {
    await requireApiUser("users");

    const users = await prisma.user.findMany({
      orderBy: [{ role: "asc" }, { createdAt: "asc" }],
      select: {
        id: true,
        username: true,
        phone: true,
        displayName: true,
        role: true,
        permissions: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return ok(users);
  } catch (error) {
    return fail(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await requireApiUser("users");
    const body = await request.json();
    const id = assertString(body.id, "id");
    const role = assertEnumValue(body.role, "role", roleValues);
    const displayName = assertOptionalString(body.displayName);
    const permissions = sanitizePermissionsInput(body.permissions);

    const updated = await prisma.user.update({
      where: { id },
      data: {
        role,
        permissions,
        ...(displayName ? { displayName } : {})
      },
      select: {
        id: true,
        username: true,
        phone: true,
        displayName: true,
        role: true,
        permissions: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (session.id === id && role !== "ADMIN") {
      return ok({ ...updated, reauthenticate: true });
    }

    return ok(updated);
  } catch (error) {
    return fail(error);
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await requireApiUser("users");
    const { searchParams } = new URL(request.url);
    const id = assertString(searchParams.get("id"), "id");

    if (session.id === id) {
      throw new ApiError(400, "\u8bf7\u5728\u8d26\u6237\u8bbe\u7f6e\u4e2d\u6ce8\u9500\u5f53\u524d\u8d26\u53f7");
    }

    const user = await prisma.user.findUnique({ where: { id }, select: { id: true, role: true } });
    if (!user) {
      throw new ApiError(404, "\u7528\u6237\u4e0d\u5b58\u5728");
    }

    if (user.role === "ADMIN") {
      const adminCount = await prisma.user.count({ where: { role: "ADMIN" } });
      if (adminCount <= 1) {
        throw new ApiError(400, "\u81f3\u5c11\u4fdd\u7559\u4e00\u4e2a\u7ba1\u7406\u5458\u8d26\u6237");
      }
    }

    if (await hasRelatedRecords(id)) {
      throw new ApiError(400, "\u8be5\u7528\u6237\u5df2\u6709\u4e1a\u52a1\u8bb0\u5f55\uff0c\u6682\u4e0d\u652f\u6301\u5220\u9664");
    }

    await prisma.user.delete({ where: { id } });
    return ok({ deleted: true });
  } catch (error) {
    return fail(error);
  }
}