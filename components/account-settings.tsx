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
      setError("��������������벻һ��");
      return;
    }

    try {
      const response = await fetch("/api/account/password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ currentPassword, nextPassword })
      });
      const payload = (await response.json()) as ApiResponse<{ changed: boolean }>;

      if (!response.ok || !payload.success) {
        throw new Error(payload.error || "�����޸�ʧ��");
      }

      setCurrentPassword("");
      setNextPassword("");
      setConfirmPassword("");
      setMessage("�����Ѹ��£���ʹ�����������µ�¼ʱע�Ᵽ�ܡ�");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "�����޸�ʧ��");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Profile</p>
        <h3 className="mt-3 text-2xl font-semibold text-slate-900">������Ϣ</h3>
        <div className="mt-6 space-y-4 text-sm text-slate-600">
          <div className="rounded-2xl bg-slate-50 px-4 py-4">
            <div className="text-xs uppercase tracking-[0.16em] text-slate-400">����</div>
            <div className="mt-2 text-base font-medium text-slate-900">{profile.displayName}</div>
          </div>
          <div className="rounded-2xl bg-slate-50 px-4 py-4">
            <div className="text-xs uppercase tracking-[0.16em] text-slate-400">�˺�</div>
            <div className="mt-2 text-base font-medium text-slate-900">{profile.username}</div>
          </div>
          <div className="rounded-2xl bg-slate-50 px-4 py-4">
            <div className="text-xs uppercase tracking-[0.16em] text-slate-400">�ֻ�����</div>
            <div className="mt-2 text-base font-medium text-slate-900">{profile.phone || "δ��"}</div>
          </div>
          <div className="rounded-2xl bg-slate-50 px-4 py-4">
            <div className="text-xs uppercase tracking-[0.16em] text-slate-400">�˻�����</div>
            <div className="mt-2 text-base font-medium text-slate-900">{profile.userTypeLabel}</div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Security</p>
        <h3 className="mt-3 text-2xl font-semibold text-slate-900">�޸�����</h3>
        <p className="mt-2 text-sm text-slate-500">֧�ֳ�����վ�˻����ܡ���������֤ͨ����ɸ���Ϊ�µĵ�¼���롣</p>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">��ǰ����</span>
            <div className="flex overflow-hidden rounded-xl border border-slate-200 focus-within:border-brand">
              <input
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                type={showCurrentPassword ? "text" : "password"}
                className="w-full border-0 px-4 py-3 outline-none"
                placeholder="�����뵱ǰ����"
              />
              <button type="button" onClick={() => setShowCurrentPassword((value) => !value)} className="border-l border-slate-200 px-4 text-sm text-slate-600">
                {showCurrentPassword ? "����" : "��ʾ"}
              </button>
            </div>
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">������</span>
            <div className="flex overflow-hidden rounded-xl border border-slate-200 focus-within:border-brand">
              <input
                value={nextPassword}
                onChange={(event) => setNextPassword(event.target.value)}
                type={showNextPassword ? "text" : "password"}
                className="w-full border-0 px-4 py-3 outline-none"
                placeholder="���� 6 λ"
              />
              <button type="button" onClick={() => setShowNextPassword((value) => !value)} className="border-l border-slate-200 px-4 text-sm text-slate-600">
                {showNextPassword ? "����" : "��ʾ"}
              </button>
            </div>
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">ȷ��������</span>
            <input
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              type="password"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand"
              placeholder="�ٴ�����������"
            />
          </label>
          {message ? <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p> : null}
          {error ? <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</p> : null}
          <button disabled={saving} className="rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-slate-400">
            {saving ? "�ύ��..." : "��������"}
          </button>
        </form>
      </section>
    </div>
  );
}
