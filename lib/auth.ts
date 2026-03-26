import { Prisma, UserRole } from "@prisma/client";
import { defaultMemberPermissions, fullPermissions, permissionKeys, permissionLabels, type PermissionMap } from "@/lib/permissions";

export { defaultMemberPermissions, fullPermissions, permissionKeys, permissionLabels };
export type { PermissionMap };

export function isAdminRole(role: UserRole | string) {
  return role === UserRole.ADMIN || role === "ADMIN";
}

export function getUserTypeLabel(role: UserRole | string) {
  return isAdminRole(role) ? "����Ա" : "��Ա";
}

export function normalizePermissions(input: Prisma.JsonValue | null | undefined, role: UserRole | string): PermissionMap {
  if (isAdminRole(role)) {
    return { ...fullPermissions };
  }

  const source = input && typeof input === "object" && !Array.isArray(input) ? (input as Record<string, unknown>) : {};
  const result = { ...defaultMemberPermissions };

  for (const key of permissionKeys) {
    if (typeof source[key] === "boolean") {
      result[key] = source[key] as boolean;
    }
  }

  return result;
}

export function sanitizePermissionsInput(input: unknown): PermissionMap {
  const source = input && typeof input === "object" && !Array.isArray(input) ? (input as Record<string, unknown>) : {};
  const result = { ...defaultMemberPermissions };

  for (const key of permissionKeys) {
    if (typeof source[key] === "boolean") {
      result[key] = source[key] as boolean;
    }
  }

  return result;
}

export function normalizePhone(value: string) {
  return value.replace(/\s+/g, "").replace(/-/g, "");
}
