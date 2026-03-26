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

  const title = useMemo(() => (mode === "login" ? "�˺ŵ�¼" : "ע�����û�"), [mode]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const endpoint = mode === "login" ? "/api/login" : "/api/register";
      const body =
        mode === "login"
          ? { identifier, password }
          : { displayName, username, phone, password };

      if (mode === "register" && password !== confirmPassword) {
        throw new Error("������������벻һ��");
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(body)
      });

      const payload = (await response.json()) as ApiResponse<unknown>;
      if (!response.ok) {
        throw new Error(payload.error || (mode === "login" ? "��¼ʧ��" : "ע��ʧ��"));
      }

      router.push("/");
      router.refresh();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "����ʧ�ܣ����Ժ�����");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.12),_transparent_32%),linear-gradient(180deg,#f8fafc_0%,#e2e8f0_100%)] px-4 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-xl lg:grid-cols-[0.95fr_1.05fr]">
        <section className="bg-slate-900 px-8 py-10 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Fruit System</p>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight">ˮ���ֿ�ϵͳ</h1>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            ֧�ֹ���Ա���Ա˫�汾����Ա�ɰ�����Ա��Ȩ�����桢���ε�ģ�飬����Ա�߱�����Ȩ�޲��ɼ��������Ա������
          </p>
          <div className="mt-8 grid gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-sm font-medium">�ֻ���ע��</div>
              <div className="mt-2 text-sm text-slate-300">���û���ֱ�����ֻ��ź��û��������˺š�</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-sm font-medium">���밲ȫ</div>
              <div className="mt-2 text-sm text-slate-300">��¼ҳ����Ԥ��Ĭ�����룬֧����ʾ/�������¼���޸����롣</div>
            </div>
          </div>
        </section>
        <section className="px-6 py-8 md:px-8 md:py-10">
          <div className="flex gap-2 rounded-full bg-slate-100 p-1">
            <button type="button" onClick={() => setMode("login")} className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition ${mode === "login" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}>
              ��¼
            </button>
            <button type="button" onClick={() => setMode("register")} className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition ${mode === "register" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}>
              ע��
            </button>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
            <p className="mt-2 text-sm text-slate-500">
              {mode === "login" ? "ʹ���û������ֻ��ŵ�¼ϵͳ��" : "ע���Ĭ����Ϊ��Ա�˻������ɹ���Ա��������Ȩ�ޡ�"}
            </p>
          </div>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            {mode === "login" ? (
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">�û������ֻ���</span>
                <input
                  value={identifier}
                  onChange={(event) => setIdentifier(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none placeholder:text-slate-400 focus:border-brand"
                  placeholder="�������û������ֻ���"
                />
              </label>
            ) : (
              <>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">����</span>
                  <input value={displayName} onChange={(event) => setDisplayName(event.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand" placeholder="����������" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">�û���</span>
                  <input value={username} onChange={(event) => setUsername(event.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand" placeholder="����ʹ����ĸ���������" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">�ֻ�����</span>
                  <input value={phone} onChange={(event) => setPhone(event.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand" placeholder="11 λ�ֻ���" />
                </label>
              </>
            )}

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">����</span>
              <div className="flex overflow-hidden rounded-xl border border-slate-200 focus-within:border-brand">
                <input
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  type={showPassword ? "text" : "password"}
                  className="w-full border-0 px-4 py-3 outline-none placeholder:text-slate-400"
                  placeholder={mode === "login" ? "����������" : "���� 6 λ"}
                />
                <button type="button" onClick={() => setShowPassword((current) => !current)} className="border-l border-slate-200 px-4 text-sm font-medium text-slate-600 transition hover:bg-slate-50">
                  {showPassword ? "����" : "��ʾ"}
                </button>
              </div>
            </label>

            {mode === "register" ? (
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">ȷ������</span>
                <input
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  type="password"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand"
                  placeholder="�ٴ���������"
                />
              </label>
            ) : null}

            {error ? <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</p> : null}
            <button disabled={loading} className="block w-full rounded-xl bg-brand px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-slate-400">
              {loading ? "�ύ��..." : mode === "login" ? "��¼ϵͳ" : "ע�Ტ����ϵͳ"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
