"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

type Mode = "login" | "register";

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

  const title = useMemo(() => (mode === "login" ? "\u8d26\u53f7\u767b\u5f55" : "\u6ce8\u518c\u65b0\u7528\u6237"), [mode]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const endpoint = mode === "login" ? "/api/login" : "/api/register";
      const body = mode === "login" ? { identifier, password } : { displayName, username, phone, password };

      if (mode === "register" && password !== confirmPassword) {
        throw new Error("\u4e24\u6b21\u8f93\u5165\u7684\u5bc6\u7801\u4e0d\u4e00\u81f4");
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body)
      });

      const payload = (await response.json()) as ApiResponse<unknown>;
      if (!response.ok) {
        throw new Error(payload.error || (mode === "login" ? "\u767b\u5f55\u5931\u8d25" : "\u6ce8\u518c\u5931\u8d25"));
      }

      router.push("/");
      router.refresh();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "\u8bf7\u6c42\u5931\u8d25\uff0c\u8bf7\u7a0d\u540e\u91cd\u8bd5");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.12),_transparent_32%),linear-gradient(180deg,#f8fafc_0%,#e2e8f0_100%)] px-4 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-xl lg:grid-cols-[0.95fr_1.05fr]">
        <section className="bg-slate-900 px-8 py-10 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Fruit System</p>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight">{"\u6c34\u679c\u4ed3\u5e93\u7cfb\u7edf"}</h1>
          <p className="mt-4 text-sm leading-7 text-slate-300">{"\u652f\u6301\u7ba1\u7406\u5458\u4e0e\u6210\u5458\u53cc\u7248\u672c\u3002\u6210\u5458\u53ef\u6309\u7ba1\u7406\u5458\u6388\u6743\u8fdb\u5165\u5e93\u5b58\u3001\u6279\u6b21\u7b49\u6a21\u5757\uff0c\u7ba1\u7406\u5458\u5177\u5907\u5b8c\u6574\u6743\u9650\u5e76\u53ef\u7ee7\u7eed\u5206\u914d\u6210\u5458\u80fd\u529b\u3002"}</p>
          <div className="mt-8 grid gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-sm font-medium">{"\u624b\u673a\u53f7\u6ce8\u518c"}</div>
              <div className="mt-2 text-sm text-slate-300">{"\u65b0\u7528\u6237\u53ef\u76f4\u63a5\u7528\u624b\u673a\u53f7\u548c\u7528\u6237\u540d\u521b\u5efa\u8d26\u53f7\u3002"}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-sm font-medium">{"\u5bc6\u7801\u5b89\u5168"}</div>
              <div className="mt-2 text-sm text-slate-300">{"\u767b\u5f55\u9875\u4e0d\u518d\u9884\u586b\u9ed8\u8ba4\u5bc6\u7801\uff0c\u652f\u6301\u663e\u793a\u6216\u9690\u85cf\uff0c\u767b\u5f55\u540e\u53ef\u4fee\u6539\u5bc6\u7801\u3002"}</div>
            </div>
          </div>
        </section>
        <section className="px-6 py-8 md:px-8 md:py-10">
          <div className="flex gap-2 rounded-full bg-slate-100 p-1">
            <button type="button" onClick={() => setMode("login")} className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition ${mode === "login" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}>{"\u767b\u5f55"}</button>
            <button type="button" onClick={() => setMode("register")} className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition ${mode === "register" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}>{"\u6ce8\u518c"}</button>
          </div>
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
            <p className="mt-2 text-sm text-slate-500">{mode === "login" ? "\u4f7f\u7528\u7528\u6237\u540d\u6216\u624b\u673a\u53f7\u767b\u5f55\u7cfb\u7edf\u3002" : "\u6ce8\u518c\u540e\u9ed8\u8ba4\u4f5c\u4e3a\u6210\u5458\u8d26\u6237\uff0c\u53ef\u7531\u7ba1\u7406\u5458\u7ee7\u7eed\u8c03\u6574\u6743\u9650\u3002"}</p>
          </div>
          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            {mode === "login" ? (
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">{"\u7528\u6237\u540d\u6216\u624b\u673a\u53f7"}</span>
                <input value={identifier} onChange={(event) => setIdentifier(event.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none placeholder:text-slate-400 focus:border-brand" placeholder={"\u8bf7\u8f93\u5165\u7528\u6237\u540d\u6216\u624b\u673a\u53f7"} />
              </label>
            ) : (
              <>
                <label className="block"><span className="mb-2 block text-sm font-medium text-slate-700">{"\u59d3\u540d"}</span><input value={displayName} onChange={(event) => setDisplayName(event.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand" placeholder={"\u8bf7\u8f93\u5165\u59d3\u540d"} /></label>
                <label className="block"><span className="mb-2 block text-sm font-medium text-slate-700">{"\u7528\u6237\u540d"}</span><input value={username} onChange={(event) => setUsername(event.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand" placeholder={"\u5efa\u8bae\u4f7f\u7528\u5b57\u6bcd\u548c\u6570\u5b57\u7ec4\u5408"} /></label>
                <label className="block"><span className="mb-2 block text-sm font-medium text-slate-700">{"\u624b\u673a\u53f7\u7801"}</span><input value={phone} onChange={(event) => setPhone(event.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand" placeholder={"11 \u4f4d\u624b\u673a\u53f7"} /></label>
              </>
            )}
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">{"\u5bc6\u7801"}</span>
              <div className="flex overflow-hidden rounded-xl border border-slate-200 focus-within:border-brand">
                <input value={password} onChange={(event) => setPassword(event.target.value)} type={showPassword ? "text" : "password"} className="w-full border-0 px-4 py-3 outline-none placeholder:text-slate-400" placeholder={mode === "login" ? "\u8bf7\u8f93\u5165\u5bc6\u7801" : "\u81f3\u5c11 6 \u4f4d"} />
                <button type="button" onClick={() => setShowPassword((current) => !current)} className="border-l border-slate-200 px-4 text-sm font-medium text-slate-600 transition hover:bg-slate-50">{showPassword ? "\u9690\u85cf" : "\u663e\u793a"}</button>
              </div>
            </label>
            {mode === "register" ? <label className="block"><span className="mb-2 block text-sm font-medium text-slate-700">{"\u786e\u8ba4\u5bc6\u7801"}</span><input value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} type="password" className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand" placeholder={"\u518d\u6b21\u8f93\u5165\u5bc6\u7801"} /></label> : null}
            {error ? <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</p> : null}
            <button disabled={loading} className="block w-full rounded-xl bg-brand px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-slate-400">{loading ? "\u63d0\u4ea4\u4e2d..." : mode === "login" ? "\u767b\u5f55\u7cfb\u7edf" : "\u6ce8\u518c\u5e76\u8fdb\u5165\u7cfb\u7edf"}</button>
          </form>
        </section>
      </div>
    </main>
  );
}
