import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const SESSION_COOKIE = "fruit_system_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

type SessionPayload = {
  userId: string;
  username: string;
  displayName: string;
  role: string;
  expiresAt: number;
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

export async function getSessionUser() {
  const store = await cookies();
  return parseSessionValue(store.get(SESSION_COOKIE)?.value);
}

export async function requirePageUser() {
  const session = await getSessionUser();
  if (!session) {
    redirect("/login");
  }
  return session;
}

export const sessionCookieName = SESSION_COOKIE;
export const sessionMaxAge = SESSION_TTL_SECONDS;