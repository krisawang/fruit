"use client";

import { FormEvent, useState } from "react";

type Profile = {
  id: string;
  username: string;
  phone: string | null;
  displayName: string;
  role: string;
  userTypeLabel: string;
};

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export function AccountSettings({ profile }: { profile: Profile }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [nextPassword, setNextPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNextPassword, setShowNextPassword] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);

    if (nextPassword !== confirmPassword) {
      setSaving(false);
      setError("\u4e24\u6b21\u8f93\u5165\u7684\u65b0\u5bc6\u7801\u4e0d\u4e00\u81f4");
      return;
    }

    try {
      const response = await fetch("/api/account/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ currentPassword, nextPassword })
      });
      const payload = (await response.json()) as ApiResponse<{ changed: boolean }>;
      if (!response.ok || !payload.success) {
        throw new Error(payload.error || "\u5bc6\u7801\u4fee\u6539\u5931\u8d25");
      }
      setCurrentPassword("");
      setNextPassword("");
      setConfirmPassword("");
      setMessage("\u5bc6\u7801\u5df2\u66f4\u65b0\uff0c\u8bf7\u7262\u8bb0\u65b0\u5bc6\u7801\u3002");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "\u5bc6\u7801\u4fee\u6539\u5931\u8d25");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Profile</p>
        <h3 className="mt-3 text-2xl font-semibold text-slate-900">{"\u4e2a\u4eba\u4fe1\u606f"}</h3>
        <div className="mt-6 space-y-4 text-sm text-slate-600">
          <div className="rounded-2xl bg-slate-50 px-4 py-4"><div className="text-xs uppercase tracking-[0.16em] text-slate-400">{"\u59d3\u540d"}</div><div className="mt-2 text-base font-medium text-slate-900">{profile.displayName}</div></div>
          <div className="rounded-2xl bg-slate-50 px-4 py-4"><div className="text-xs uppercase tracking-[0.16em] text-slate-400">{"\u8d26\u53f7"}</div><div className="mt-2 text-base font-medium text-slate-900">{profile.username}</div></div>
          <div className="rounded-2xl bg-slate-50 px-4 py-4"><div className="text-xs uppercase tracking-[0.16em] text-slate-400">{"\u624b\u673a\u53f7\u7801"}</div><div className="mt-2 text-base font-medium text-slate-900">{profile.phone || "\u672a\u7ed1\u5b9a"}</div></div>
          <div className="rounded-2xl bg-slate-50 px-4 py-4"><div className="text-xs uppercase tracking-[0.16em] text-slate-400">{"\u8d26\u6237\u7c7b\u578b"}</div><div className="mt-2 text-base font-medium text-slate-900">{profile.userTypeLabel}</div></div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Security</p>
        <h3 className="mt-3 text-2xl font-semibold text-slate-900">{"\u4fee\u6539\u5bc6\u7801"}</h3>
        <p className="mt-2 text-sm text-slate-500">{"\u9a8c\u8bc1\u5f53\u524d\u5bc6\u7801\u540e\uff0c\u53ef\u4e3a\u8d26\u6237\u8bbe\u7f6e\u65b0\u7684\u767b\u5f55\u5bc6\u7801\u3002"}</p>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">{"\u5f53\u524d\u5bc6\u7801"}</span>
            <div className="flex overflow-hidden rounded-xl border border-slate-200 focus-within:border-brand">
              <input value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} type={showCurrentPassword ? "text" : "password"} className="w-full border-0 px-4 py-3 outline-none" placeholder={"\u8bf7\u8f93\u5165\u5f53\u524d\u5bc6\u7801"} />
              <button type="button" onClick={() => setShowCurrentPassword((value) => !value)} className="border-l border-slate-200 px-4 text-sm text-slate-600">{showCurrentPassword ? "\u9690\u85cf" : "\u663e\u793a"}</button>
            </div>
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">{"\u65b0\u5bc6\u7801"}</span>
            <div className="flex overflow-hidden rounded-xl border border-slate-200 focus-within:border-brand">
              <input value={nextPassword} onChange={(event) => setNextPassword(event.target.value)} type={showNextPassword ? "text" : "password"} className="w-full border-0 px-4 py-3 outline-none" placeholder={"\u81f3\u5c11 6 \u4f4d"} />
              <button type="button" onClick={() => setShowNextPassword((value) => !value)} className="border-l border-slate-200 px-4 text-sm text-slate-600">{showNextPassword ? "\u9690\u85cf" : "\u663e\u793a"}</button>
            </div>
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">{"\u786e\u8ba4\u65b0\u5bc6\u7801"}</span>
            <input value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} type="password" className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand" placeholder={"\u518d\u6b21\u8f93\u5165\u65b0\u5bc6\u7801"} />
          </label>
          {message ? <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p> : null}
          {error ? <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</p> : null}
          <button disabled={saving} className="rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-slate-400">{saving ? "\u63d0\u4ea4\u4e2d..." : "\u66f4\u65b0\u5bc6\u7801"}</button>
        </form>
      </section>
    </div>
  );
}
