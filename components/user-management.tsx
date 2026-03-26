"use client";

import { useEffect, useMemo, useState } from "react";
import { defaultMemberPermissions, permissionKeys, permissionLabels, type PermissionMap } from "@/lib/permissions";

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
    return {
      dashboard: true,
      inventory: true,
      inbound: true,
      outbound: true,
      loss: true,
      batches: true,
      reports: true,
      users: true
    };
  }

  const source = value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
  const next = { ...defaultMemberPermissions };

  for (const key of permissionKeys) {
    if (typeof source[key] === "boolean") {
      next[key] = source[key] as boolean;
    }
  }

  return next;
}

export function UserManagement() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function loadUsers() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/users", { credentials: "include", cache: "no-store" });
      const payload = (await response.json()) as ApiResponse<UserRecord[]>;
      if (!response.ok || !payload.success || !payload.data) {
        throw new Error(payload.error || "�����û��б�ʧ��");
      }
      setUsers(payload.data);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "�����û��б�ʧ��");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  const rows = useMemo(() => users.map((user) => ({ ...user, effectivePermissions: normalizePermissions(user.permissions, user.role) })), [users]);

  async function updateUser(user: UserRecord, nextRole: UserRecord["role"], nextPermissions: PermissionMap) {
    setSavingId(user.id);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch("/api/users", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          id: user.id,
          role: nextRole,
          permissions: nextPermissions
        })
      });
      const payload = (await response.json()) as ApiResponse<UserRecord & { reauthenticate?: boolean }>;
      if (!response.ok || !payload.success || !payload.data) {
        throw new Error(payload.error || "�û�Ȩ�޸���ʧ��");
      }

      setMessage(payload.data.reauthenticate ? "��ǰ�˺Ž�ɫ�Ѹ��£��������µ�¼��ˢ��Ȩ�ޡ�" : "�û�Ȩ���Ѹ���");
      await loadUsers();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "�û�Ȩ�޸���ʧ��");
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div className="space-y-6">
      {message ? <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p> : null}
      {error ? <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</p> : null}
      {loading ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center text-sm text-slate-500">�û����ݼ�����...</div>
      ) : (
        <div className="grid gap-4">
          {rows.map((user) => (
            <section key={user.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{user.displayName}</h3>
                  <p className="mt-1 text-sm text-slate-500">{user.username} �� {user.phone || "δ���ֻ�"}</p>
                </div>
                <label className="inline-flex items-center gap-3 text-sm text-slate-600">
                  <span>��ɫ</span>
                  <select
                    value={user.role}
                    onChange={(event) => updateUser(user, event.target.value as UserRecord["role"], user.role === "ADMIN" ? user.effectivePermissions : user.effectivePermissions)}
                    className="rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-brand"
                  >
                    <option value="ADMIN">����Ա</option>
                    <option value="MANAGER">��Ա</option>
                    <option value="CLERK">��Ա</option>
                  </select>
                </label>
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                {permissionKeys.map((key) => {
                  const checked = user.effectivePermissions[key];
                  const disabled = user.role === "ADMIN" || savingId === user.id;
                  return (
                    <label key={key} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                      <span>{permissionLabels[key]}</span>
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={disabled}
                        onChange={(event) => {
                          const nextPermissions = { ...user.effectivePermissions, [key]: event.target.checked };
                          updateUser(user, user.role, nextPermissions);
                        }}
                        className="h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand"
                      />
                    </label>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
