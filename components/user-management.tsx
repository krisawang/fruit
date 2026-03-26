"use client";

import { useEffect, useMemo, useState } from "react";
import { defaultMemberPermissions, permissionLabels, visiblePermissionKeys, type PermissionMap } from "@/lib/permissions";

type UserRecord = {
  id: string;
  username: string;
  phone: string | null;
  displayName: string;
  role: "ADMIN" | "MANAGER" | "CLERK";
  permissions: PermissionMap | null;
  createdAt: string;
  updatedAt: string;
};

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

function normalizePermissions(value: unknown, role: UserRecord["role"]): PermissionMap {
  if (role === "ADMIN") {
    return { dashboard: true, inventory: true, inbound: true, outbound: true, loss: true, batches: true, reports: true, users: true };
  }
  const source = value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
  const next = { ...defaultMemberPermissions };
  for (const key of Object.keys(next) as Array<keyof PermissionMap>) {
    if (typeof source[key] === "boolean") next[key] = source[key] as boolean;
  }
  return next;
}

function formatDate(value: string) {
  return value.slice(0, 10);
}

function roleLabel(role: UserRecord["role"]) {
  if (role === "ADMIN") return "\u7ba1\u7406\u5458";
  if (role === "MANAGER") return "\u6210\u5458";
  return "\u6210\u5458";
}

export function UserManagement() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function loadUsers() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/users", { credentials: "include", cache: "no-store" });
      const payload = (await response.json()) as ApiResponse<UserRecord[]>;
      if (!response.ok || !payload.success || !payload.data) throw new Error(payload.error || "\u52a0\u8f7d\u7528\u6237\u5217\u8868\u5931\u8d25");
      setUsers(payload.data);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "\u52a0\u8f7d\u7528\u6237\u5217\u8868\u5931\u8d25");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadUsers();
  }, []);

  const rows = useMemo(() => users.map((user) => ({ ...user, effectivePermissions: normalizePermissions(user.permissions, user.role) })), [users]);

  async function updateUser(user: UserRecord, nextRole: UserRecord["role"], nextPermissions: PermissionMap) {
    setSavingId(user.id);
    setError(null);
    setMessage(null);
    try {
      const response = await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id: user.id, role: nextRole, permissions: nextPermissions })
      });
      const payload = (await response.json()) as ApiResponse<UserRecord & { reauthenticate?: boolean }>;
      if (!response.ok || !payload.success || !payload.data) throw new Error(payload.error || "\u66f4\u65b0\u7528\u6237\u6743\u9650\u5931\u8d25");
      setMessage(payload.data.reauthenticate ? "\u5f53\u524d\u8d26\u53f7\u89d2\u8272\u5df2\u66f4\u65b0\uff0c\u5efa\u8bae\u91cd\u65b0\u767b\u5f55\u5237\u65b0\u6743\u9650\u3002" : "\u7528\u6237\u6743\u9650\u5df2\u66f4\u65b0");
      await loadUsers();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "\u66f4\u65b0\u7528\u6237\u6743\u9650\u5931\u8d25");
    } finally {
      setSavingId(null);
    }
  }

  async function deleteUser(user: UserRecord) {
    const confirmed = window.confirm(`\u786e\u8ba4\u5220\u9664\u7528\u6237\u300c${user.displayName}\u300d\u5417\uff1f`);
    if (!confirmed) {
      return;
    }

    setDeletingId(user.id);
    setError(null);
    setMessage(null);
    try {
      const response = await fetch(`/api/users?id=${encodeURIComponent(user.id)}`, {
        method: "DELETE",
        credentials: "include"
      });
      const payload = (await response.json()) as ApiResponse<{ deleted: boolean }>;
      if (!response.ok || !payload.success) throw new Error(payload.error || "\u5220\u9664\u7528\u6237\u5931\u8d25");
      setMessage("\u7528\u6237\u5df2\u5220\u9664");
      await loadUsers();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "\u5220\u9664\u7528\u6237\u5931\u8d25");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-6">
      {message ? <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p> : null}
      {error ? <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</p> : null}
      {loading ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center text-sm text-slate-500">{"\u7528\u6237\u6570\u636e\u52a0\u8f7d\u4e2d..."}</div>
      ) : (
        <div className="grid gap-4">
          {rows.map((user) => (
            <section key={user.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{user.displayName}</h3>
                  <p className="mt-1 text-sm text-slate-500">{`${user.username} / ${user.phone || "\u672a\u7ed1\u5b9a\u624b\u673a\u53f7"}`}</p>
                  <p className="mt-2 text-xs text-slate-400">{`\u521b\u5efa\u65f6\u95f4\uff1a${formatDate(user.createdAt)} / \u6700\u8fd1\u66f4\u65b0\uff1a${formatDate(user.updatedAt)}`}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <label className="inline-flex items-center gap-3 text-sm text-slate-600">
                    <span>{"\u89d2\u8272"}</span>
                    <select
                      value={user.role}
                      onChange={(event) => void updateUser(user, event.target.value as UserRecord["role"], user.effectivePermissions)}
                      className="rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-brand"
                    >
                      <option value="ADMIN">{"\u7ba1\u7406\u5458"}</option>
                      <option value="MANAGER">{"\u6210\u5458"}</option>
                      <option value="CLERK">{"\u6210\u5458"}</option>
                    </select>
                  </label>
                  <span className="rounded-full bg-slate-100 px-3 py-2 text-xs font-medium text-slate-600">{roleLabel(user.role)}</span>
                  <button
                    type="button"
                    onClick={() => void deleteUser(user)}
                    disabled={savingId === user.id || deletingId === user.id}
                    className="rounded-xl border border-rose-200 px-3 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {deletingId === user.id ? "\u5220\u9664\u4e2d..." : "\u5220\u9664\u7528\u6237"}
                  </button>
                </div>
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {visiblePermissionKeys.map((key) => (
                  <label key={key} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                    <span>{permissionLabels[key]}</span>
                    <input
                      type="checkbox"
                      checked={user.effectivePermissions[key]}
                      disabled={user.role === "ADMIN" || savingId === user.id || deletingId === user.id}
                      onChange={(event) => void updateUser(user, user.role, { ...user.effectivePermissions, [key]: event.target.checked })}
                      className="h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand"
                    />
                  </label>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}