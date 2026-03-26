"use client";

import { FormEvent, SVGProps, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { LogoutButton } from "@/components/logout-button";

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

function EyeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6-10-6-10-6Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M3 3l18 18" />
      <path d="M10.6 10.7a3 3 0 0 0 4.2 4.2" />
      <path d="M9.9 5.2A11 11 0 0 1 12 5c6.4 0 10 7 10 7a18.7 18.7 0 0 1-4.1 4.8" />
      <path d="M6.7 6.7C3.9 8.4 2 12 2 12a18.4 18.4 0 0 0 6.2 6.1" />
    </svg>
  );
}

function PasswordToggle({ visible, onClick }: { visible: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="border-l border-slate-200 px-4 text-slate-500 transition hover:bg-slate-50 hover:text-slate-700" aria-label={visible ? "隐藏密码" : "显示密码"}>
      {visible ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
    </button>
  );
}

export function AccountSettings({ profile }: { profile: Profile }) {
  const router = useRouter();
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
  const [accountMessage, setAccountMessage] = useState<string | null>(null);
  const [accountError, setAccountError] = useState<string | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  const phoneStatus = useMemo(() => (profileState.phone ? "已绑定" : "未绑定"), [profileState.phone]);

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
        throw new Error(payload.error || "资料更新失败");
      }
      setProfileState(payload.data);
      setDisplayName(payload.data.displayName);
      setUsername(payload.data.username);
      setPhone(payload.data.phone || "");
      setProfileMessage("账户资料已更新");
    } catch (requestError) {
      setProfileError(requestError instanceof Error ? requestError.message : "资料更新失败");
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
      setPasswordError("两次输入的新密码不一致");
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
        throw new Error(payload.error || "密码修改失败");
      }
      setCurrentPassword("");
      setNextPassword("");
      setConfirmPassword("");
      setPasswordMessage("密码已更新，请牢记新密码。");
    } catch (requestError) {
      setPasswordError(requestError instanceof Error ? requestError.message : "密码修改失败");
    } finally {
      setSavingPassword(false);
    }
  }

  async function handleDeleteAccount() {
    if (!window.confirm("确认注销当前账号吗？注销后将退出系统。")) {
      return;
    }

    setDeletingAccount(true);
    setAccountError(null);
    setAccountMessage(null);
    try {
      const response = await fetch("/api/account/profile", {
        method: "DELETE",
        credentials: "include"
      });
      const payload = (await response.json()) as ApiResponse<{ deleted: boolean }>;
      if (!response.ok || !payload.success) {
        throw new Error(payload.error || "账号注销失败");
      }
      setAccountMessage("账号已注销，正在返回登录页。");
      router.replace("/login");
      router.refresh();
    } catch (requestError) {
      setAccountError(requestError instanceof Error ? requestError.message : "账号注销失败");
    } finally {
      setDeletingAccount(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Profile</p>
          <h3 className="mt-3 text-2xl font-semibold text-slate-900">个人信息</h3>
          <div className="mt-6 space-y-4 text-sm text-slate-600">
            <div className="rounded-2xl bg-slate-50 px-4 py-4"><div className="text-xs uppercase tracking-[0.16em] text-slate-400">姓名</div><div className="mt-2 text-base font-medium text-slate-900">{profileState.displayName}</div></div>
            <div className="rounded-2xl bg-slate-50 px-4 py-4"><div className="text-xs uppercase tracking-[0.16em] text-slate-400">登录用户名</div><div className="mt-2 text-base font-medium text-slate-900">{profileState.username}</div></div>
            <div className="rounded-2xl bg-slate-50 px-4 py-4"><div className="text-xs uppercase tracking-[0.16em] text-slate-400">手机号码</div><div className="mt-2 text-base font-medium text-slate-900">{profileState.phone || "未绑定"}</div></div>
            <div className="rounded-2xl bg-slate-50 px-4 py-4"><div className="text-xs uppercase tracking-[0.16em] text-slate-400">账户类型</div><div className="mt-2 text-base font-medium text-slate-900">{profileState.userTypeLabel}</div></div>
            <div className="rounded-2xl bg-slate-50 px-4 py-4"><div className="text-xs uppercase tracking-[0.16em] text-slate-400">手机号状态</div><div className="mt-2 text-base font-medium text-slate-900">{phoneStatus}</div></div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <LogoutButton />
            <button type="button" onClick={handleDeleteAccount} disabled={deletingAccount} className="rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60">{deletingAccount ? "注销中..." : "注销当前账号"}</button>
          </div>
          {accountMessage ? <p className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{accountMessage}</p> : null}
          {accountError ? <p className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{accountError}</p> : null}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Account</p>
          <h3 className="mt-3 text-2xl font-semibold text-slate-900">修改资料</h3>
          <p className="mt-2 text-sm text-slate-500">支持修改姓名、登录用户名，以及绑定或更换手机号。</p>
          <form className="mt-6 space-y-4" onSubmit={handleProfileSubmit}>
            <label className="block"><span className="mb-2 block text-sm font-medium text-slate-700">姓名</span><input value={displayName} onChange={(event) => setDisplayName(event.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand" placeholder="请输入姓名" /></label>
            <label className="block"><span className="mb-2 block text-sm font-medium text-slate-700">登录用户名</span><input value={username} onChange={(event) => setUsername(event.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand" placeholder="请输入登录用户名" /></label>
            <label className="block"><span className="mb-2 block text-sm font-medium text-slate-700">手机号</span><input value={phone} onChange={(event) => setPhone(event.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand" placeholder="请输入 11 位手机号，留空表示暂不绑定" /></label>
            {profileMessage ? <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{profileMessage}</p> : null}
            {profileError ? <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{profileError}</p> : null}
            <button disabled={savingProfile} className="rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-slate-400">{savingProfile ? "保存中..." : "保存资料"}</button>
          </form>
        </section>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Security</p>
        <h3 className="mt-3 text-2xl font-semibold text-slate-900">修改密码</h3>
        <p className="mt-2 text-sm text-slate-500">验证当前密码后，可为账户设置新的登录密码。</p>
        <form className="mt-6 grid gap-4 lg:grid-cols-3" onSubmit={handlePasswordSubmit}>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">当前密码</span>
            <div className="flex overflow-hidden rounded-xl border border-slate-200 focus-within:border-brand">
              <input value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} type={showCurrentPassword ? "text" : "password"} className="w-full border-0 px-4 py-3 outline-none" placeholder="请输入当前密码" />
              <PasswordToggle visible={showCurrentPassword} onClick={() => setShowCurrentPassword((value) => !value)} />
            </div>
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">新密码</span>
            <div className="flex overflow-hidden rounded-xl border border-slate-200 focus-within:border-brand">
              <input value={nextPassword} onChange={(event) => setNextPassword(event.target.value)} type={showNextPassword ? "text" : "password"} className="w-full border-0 px-4 py-3 outline-none" placeholder="至少 6 位" />
              <PasswordToggle visible={showNextPassword} onClick={() => setShowNextPassword((value) => !value)} />
            </div>
          </label>
          <label className="block"><span className="mb-2 block text-sm font-medium text-slate-700">确认新密码</span><input value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} type="password" className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand" placeholder="再次输入新密码" /></label>
          <div className="lg:col-span-3 space-y-3">
            {passwordMessage ? <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{passwordMessage}</p> : null}
            {passwordError ? <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{passwordError}</p> : null}
            <button disabled={savingPassword} className="rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-slate-400">{savingPassword ? "提交中..." : "更新密码"}</button>
          </div>
        </form>
      </section>
    </div>
  );
}