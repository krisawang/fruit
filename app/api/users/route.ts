import { UserRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/api";
import { sanitizePermissionsInput } from "@/lib/auth";
import { requireApiUser } from "@/lib/session";
import { assertEnumValue, assertOptionalString, assertString } from "@/lib/validation";

const roleValues = [UserRole.ADMIN, UserRole.MANAGER, UserRole.CLERK] as const;

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
