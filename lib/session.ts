import { UserRole, type Prisma } from "@prisma/client";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getUserTypeLabel, isAdminRole, normalizePermissions } from "@/lib/auth";
import { fullPermissions, type PermissionKey, type PermissionMap } from "@/lib/permissions";
import { ApiError } from "@/lib/validation";

const SESSION_COOKIE = "fruit_system_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

type SessionPayload = {
  userId: string;
  username: string;
  displayName: string;
  role: string;
  expiresAt: number;
};

export type CurrentUser = {
  id: string;
  username: string;
  phone: string | null;
  displayName: string;
  role: UserRole;
  permissions: PermissionMap;
  isAdmin: boolean;
  userTypeLabel: string;
};

function getSessionSecret() {
  return process.env.AUTH_SECRET || "dev-only-secret-change-me";
}

function sign(value: string) {
  return createHmac("sha256", getSessionSecret()).update(value).digest("hex");
}

export function createSessionValue(payload: Omit<SessionPayload, "expiresAt">) {
  const sessionPayload: SessionPayload = {
    ...payload,
    expiresAt: Date.now() + SESSION_TTL_SECONDS * 1000
  };
  const encoded = Buffer.from(JSON.stringify(sessionPayload)).toString("base64url");
  const signature = sign(encoded);
  return `${encoded}.${signature}`;
}

export function parseSessionValue(value?: string | null): SessionPayload | null {
  if (!value) {
    return null;
  }

  const [encoded, signature] = value.split(".");
  if (!encoded || !signature) {
    return null;
  }

  const expected = sign(encoded);
  const valid = timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  if (!valid) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as SessionPayload;
    if (payload.expiresAt < Date.now()) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

async function buildCurrentUser(user: {
  id: string;
  username: string;
  phone: string | null;
  displayName: string;
  role: UserRole;
  permissions: Prisma.JsonValue | null;
}): Promise<CurrentUser> {
  const permissions = isAdminRole(user.role) ? { ...fullPermissions } : normalizePermissions(user.permissions, user.role);

  return {
    id: user.id,
    username: user.username,
    phone: user.phone,
    displayName: user.displayName,
    role: user.role,
    permissions,
    isAdmin: isAdminRole(user.role),
    userTypeLabel: getUserTypeLabel(user.role)
  };
}

export async function getSessionPayload() {
  const store = await cookies();
  return parseSessionValue(store.get(SESSION_COOKIE)?.value);
}

export async function clearSession() {
  const store = await cookies();
  store.set({
    name: SESSION_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/"
  });
}

export async function getSessionUser() {
  const payload = await getSessionPayload();
  if (!payload) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      username: true,
      phone: true,
      displayName: true,
      role: true,
      permissions: true
    }
  });

  if (!user) {
    return null;
  }

  return buildCurrentUser(user);
}

export async function requirePageUser(permission?: PermissionKey) {
  const session = await getSessionUser();
  if (!session) {
    redirect("/login");
  }

  if (permission && !session.permissions[permission]) {
    redirect("/");
  }

  return session;
}

export async function requireApiUser(permission?: PermissionKey) {
  const session = await getSessionUser();
  if (!session) {
    throw new ApiError(401, "Unauthorized");
  }

  if (permission && !session.permissions[permission]) {
    throw new ApiError(403, "Forbidden");
  }

  return session;
}

export const sessionCookieName = SESSION_COOKIE;
export const sessionMaxAge = SESSION_TTL_SECONDS;
