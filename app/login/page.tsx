"use client";

import { FormEvent, SVGProps, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

type Mode = "login" | "register";

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

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const title = useMemo(() => (mode === "login" ? "账号登录" : "注册新用户"), [mode]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const endpoint = mode === "login" ? "/api/login" : "/api/register";
      const body = mode === "login" ? { identifier, password } : { displayName, username, phone, password };

      if (mode === "register" && password !== confirmPassword) {
        throw new Error("两次输入的密码不一致");
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body)
      });

      const payload = (await response.json()) as ApiResponse<unknown>;
      if (!response.ok) {
        throw new Error(payload.error || (mode === "login" ? "登录失败" : "注册失败"));
      }

      router.push("/");
      router.refresh();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "请求失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.12),_transparent_32%),linear-gradient(180deg,#f8fafc_0%,#e2e8f0_100%)] px-4 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-xl lg:grid-cols-[0.95fr_1.05fr]">
        <section className="bg-slate-900 px-8 py-10 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Fruit System</p>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight">水果仓库系统</h1>
          <p className="mt-4 text-sm leading-7 text-slate-300">支持管理员与成员双版本。成员可按管理员授权进入库存、入库、出库和报表模块，管理员具备完整权限并可继续分配成员能力。</p>
          <div className="mt-8 grid gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><div className="text-sm font-medium">手机号注册</div><div className="mt-2 text-sm text-slate-300">新用户可直接用手机号和用户名创建账号。</div></div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><div className="text-sm font-medium">密码安全</div><div className="mt-2 text-sm text-slate-300">密码框改为小眼睛显示与隐藏，登录后也可在账户页修改密码。</div></div>
          </div>
        </section>
        <section className="px-6 py-8 md:px-8 md:py-10">
          <div className="flex gap-2 rounded-full bg-slate-100 p-1">
            <button type="button" onClick={() => setMode("login")} className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition ${mode === "login" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}>登录</button>
            <button type="button" onClick={() => setMode("register")} className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition ${mode === "register" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}>注册</button>
          </div>
          <div className="mt-8"><h2 className="text-2xl font-semibold text-slate-900">{title}</h2><p className="mt-2 text-sm text-slate-500">{mode === "login" ? "使用用户名或手机号登录系统。" : "注册后默认作为成员账户，可由管理员继续调整权限。"}</p></div>
          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            {mode === "login" ? (
              <label className="block"><span className="mb-2 block text-sm font-medium text-slate-700">用户名或手机号</span><input value={identifier} onChange={(event) => setIdentifier(event.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none placeholder:text-slate-400 focus:border-brand" placeholder="请输入用户名或手机号" /></label>
            ) : (
              <>
                <label className="block"><span className="mb-2 block text-sm font-medium text-slate-700">姓名</span><input value={displayName} onChange={(event) => setDisplayName(event.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand" placeholder="请输入姓名" /></label>
                <label className="block"><span className="mb-2 block text-sm font-medium text-slate-700">用户名</span><input value={username} onChange={(event) => setUsername(event.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand" placeholder="建议使用字母和数字组合" /></label>
                <label className="block"><span className="mb-2 block text-sm font-medium text-slate-700">手机号码</span><input value={phone} onChange={(event) => setPhone(event.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand" placeholder="11 位手机号" /></label>
              </>
            )}
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">密码</span>
              <div className="flex overflow-hidden rounded-xl border border-slate-200 focus-within:border-brand">
                <input value={password} onChange={(event) => setPassword(event.target.value)} type={showPassword ? "text" : "password"} className="w-full border-0 px-4 py-3 outline-none placeholder:text-slate-400" placeholder={mode === "login" ? "请输入密码" : "至少 6 位"} />
                <PasswordToggle visible={showPassword} onClick={() => setShowPassword((current) => !current)} />
              </div>
            </label>
            {mode === "register" ? <label className="block"><span className="mb-2 block text-sm font-medium text-slate-700">确认密码</span><input value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} type="password" className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand" placeholder="再次输入密码" /></label> : null}
            {error ? <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</p> : null}
            <button disabled={loading} className="block w-full rounded-xl bg-brand px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-slate-400">{loading ? "提交中..." : mode === "login" ? "登录系统" : "注册并进入系统"}</button>
          </form>
        </section>
      </div>
    </main>
  );
}