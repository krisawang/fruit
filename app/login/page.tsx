"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123456");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/dashboard", { credentials: "include" }).then((response) => {
      if (response.ok) {
        router.replace("/dashboard");
      }
    });
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ username, password })
      });

      const payload = await response.json();
      if (!response.ok) {
        setError(payload.error || "登录失败");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("登录请求失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Fruit System</p>
          <h1 className="mt-3 text-2xl font-semibold text-slate-900">仓管登录</h1>
          <p className="mt-2 text-sm text-slate-500">默认种子账号为 admin / admin123456，首次启动请先执行数据库迁移和 seed。</p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">账号</span>
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none placeholder:text-slate-400 focus:border-brand"
              placeholder="admin"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">密码</span>
            <div className="flex overflow-hidden rounded-xl border border-slate-200 focus-within:border-brand">
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type={showPassword ? "text" : "password"}
                className="w-full border-0 px-4 py-3 outline-none placeholder:text-slate-400"
                placeholder="请输入密码"
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="border-l border-slate-200 px-4 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              >
                {showPassword ? "隐藏" : "显示"}
              </button>
            </div>
          </label>
          {error ? <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</p> : null}
          <button disabled={loading} className="block w-full rounded-xl bg-brand px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-slate-400">
            {loading ? "登录中..." : "登录系统"}
          </button>
        </form>
      </div>
    </main>
  );
}
