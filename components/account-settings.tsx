"use client";

import { FormEvent, useMemo, useState } from "react";

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
  const [profileState, setProfileState] = useState(profile);
  const [displayName, setDisplayName] = useState(profile.displayName);
  const [username, setUsername] = useState(profile.username);
  const [phone, setPhone] = useState(profile.phone || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [nextPassword, setNextPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNextPassword, setShowNextPassword] = useState(false);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const phoneStatus = useMemo(() => (profileState.phone ? "\u5df2\u7ed1\u5b9a" : "\u672a\u7ed1\u5b9a"), [profileState.phone]);

  async function handleProfileSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingProfile(true);
    setProfileError(null);
    setProfileMessage(null);

    try {
      const response = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ displayName, username, phone })
      });
      const payload = (await response.json()) as ApiResponse<Profile>;
      if (!response.ok || !payload.success || !payload.data) {
        throw new Error(payload.error || "\u8d44\u6599\u66f4\u65b0\u5931\u8d25");
      }
      setProfileState(payload.data);
      setDisplayName(payload.data.displayName);
      setUsername(payload.data.username);
      setPhone(payload.data.phone || "");
      setProfileMessage("\u8d26\u6237\u8d44\u6599\u5df2\u66f4\u65b0");
    } catch (requestError) {
      setProfileError(requestError instanceof Error ? requestError.message : "\u8d44\u6599\u66f4\u65b0\u5931\u8d25");
    } finally {
      setSavingProfile(false);
    }
  }

  async function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingPassword(true);
    setPasswordError(null);
    setPasswordMessage(null);

    if (nextPassword !== confirmPassword) {
      setSavingPassword(false);
      setPasswordError("\u4e24\u6b21\u8f93\u5165\u7684\u65b0\u5bc6\u7801\u4e0d\u4e00\u81f4");
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
      setPasswordMessage("\u5bc6\u7801\u5df2\u66f4\u65b0\uff0c\u8bf7\u7262\u8bb0\u65b0\u5bc6\u7801\u3002");
    } catch (requestError) {
      setPasswordError(requestError instanceof Error ? requestError.message : "\u5bc6\u7801\u4fee\u6539\u5931\u8d25");
    } finally {
      setSavingPassword(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Profile</p>
          <h3 className="mt-3 text-2xl font-semibold text-slate-900">{"\u4e2a\u4eba\u4fe1\u606f"}</h3>
          <div className="mt-6 space-y-4 text-sm text-slate-600">
            <div className="rounded-2xl bg-slate-50 px-4 py-4"><div className="text-xs uppercase tracking-[0.16em] text-slate-400">{"\u59d3\u540d"}</div><div className="mt-2 text-base font-medium text-slate-900">{profileState.displayName}</div></div>
            <div className="rounded-2xl bg-slate-50 px-4 py-4"><div className="text-xs uppercase tracking-[0.16em] text-slate-400">{"\u767b\u5f55\u7528\u6237\u540d"}</div><div className="mt-2 text-base font-medium text-slate-900">{profileState.username}</div></div>
            <div className="rounded-2xl bg-slate-50 px-4 py-4"><div className="text-xs uppercase tracking-[0.16em] text-slate-400">{"\u624b\u673a\u53f7\u7801"}</div><div className="mt-2 text-base font-medium text-slate-900">{profileState.phone || "\u672a\u7ed1\u5b9a"}</div></div>
            <div className="rounded-2xl bg-slate-50 px-4 py-4"><div className="text-xs uppercase tracking-[0.16em] text-slate-400">{"\u8d26\u6237\u7c7b\u578b"}</div><div className="mt-2 text-base font-medium text-slate-900">{profileState.userTypeLabel}</div></div>
            <div className="rounded-2xl bg-slate-50 px-4 py-4"><div className="text-xs uppercase tracking-[0.16em] text-slate-400">{"\u624b\u673a\u53f7\u72b6\u6001"}</div><div className="mt-2 text-base font-medium text-slate-900">{phoneStatus}</div></div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Account</p>
          <h3 className="mt-3 text-2xl font-semibold text-slate-900">{"\u4fee\u6539\u8d44\u6599"}</h3>
          <p className="mt-2 text-sm text-slate-500">{"\u652f\u6301\u4fee\u6539\u59d3\u540d\u3001\u767b\u5f55\u7528\u6237\u540d\uff0c\u4ee5\u53ca\u7ed1\u5b9a\u6216\u66f4\u6362\u624b\u673a\u53f7\u3002"}</p>
          <form className="mt-6 space-y-4" onSubmit={handleProfileSubmit}>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">{"\u59d3\u540d"}</span>
              <input value={displayName} onChange={(event) => setDisplayName(event.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand" placeholder={"\u8bf7\u8f93\u5165\u59d3\u540d"} />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">{"\u767b\u5f55\u7528\u6237\u540d"}</span>
              <input value={username} onChange={(event) => setUsername(event.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand" placeholder={"\u8bf7\u8f93\u5165\u767b\u5f55\u7528\u6237\u540d"} />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">{"\u624b\u673a\u53f7"}</span>
              <input value={phone} onChange={(event) => setPhone(event.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand" placeholder={"\u8bf7\u8f93\u5165 11 \u4f4d\u624b\u673a\u53f7\uff0c\u7559\u7a7a\u8868\u793a\u6682\u4e0d\u7ed1\u5b9a"} />
            </label>
            {profileMessage ? <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{profileMessage}</p> : null}
            {profileError ? <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{profileError}</p> : null}
            <button disabled={savingProfile} className="rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-slate-400">{savingProfile ? "\u4fdd\u5b58\u4e2d..." : "\u4fdd\u5b58\u8d44\u6599"}</button>
          </form>
        </section>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Security</p>
        <h3 className="mt-3 text-2xl font-semibold text-slate-900">{"\u4fee\u6539\u5bc6\u7801"}</h3>
        <p className="mt-2 text-sm text-slate-500">{"\u9a8c\u8bc1\u5f53\u524d\u5bc6\u7801\u540e\uff0c\u53ef\u4e3a\u8d26\u6237\u8bbe\u7f6e\u65b0\u7684\u767b\u5f55\u5bc6\u7801\u3002"}</p>
        <form className="mt-6 grid gap-4 lg:grid-cols-3" onSubmit={handlePasswordSubmit}>
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
          <div className="lg:col-span-3 space-y-3">
            {passwordMessage ? <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{passwordMessage}</p> : null}
            {passwordError ? <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{passwordError}</p> : null}
            <button disabled={savingPassword} className="rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-slate-400">{savingPassword ? "\u63d0\u4ea4\u4e2d..." : "\u66f4\u65b0\u5bc6\u7801"}</button>
          </div>
        </form>
      </section>
    </div>
  );
}