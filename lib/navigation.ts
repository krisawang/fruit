import type { Route } from "next";
import type { PermissionKey } from "@/lib/permissions";

export const moduleEntries: Array<{
  href: Route;
  label: string;
  shortLabel: string;
  description: string;
  permission: PermissionKey;
  tone: string;
}> = [
  {
    href: "/dashboard",
    label: "�Ǳ���",
    shortLabel: "����",
    description: "�鿴������ơ�Ԥ���ͽ��չؼ����ݡ�",
    permission: "dashboard",
    tone: "from-sky-500 via-cyan-500 to-teal-400"
  },
  {
    href: "/inventory",
    label: "������",
    shortLabel: "���",
    description: "ά����Ʒ���ϡ����������ͼƬ���顣",
    permission: "inventory",
    tone: "from-emerald-500 via-lime-500 to-amber-300"
  },
  {
    href: "/inbound",
    label: "������",
    shortLabel: "���",
    description: "�Ǽǵ��������κ�������Ʒ��⡣",
    permission: "inbound",
    tone: "from-orange-500 via-amber-500 to-yellow-300"
  },
  {
    href: "/outbound",
    label: "�������",
    shortLabel: "����",
    description: "�������ۼ��������ͷ�����",
    permission: "outbound",
    tone: "from-indigo-500 via-blue-500 to-cyan-400"
  },
  {
    href: "/loss",
    label: "��ĵǼ�",
    shortLabel: "���",
    description: "�ǼǸ��𡢱��Ϻ��쳣�����١�",
    permission: "loss",
    tone: "from-rose-500 via-pink-500 to-orange-300"
  },
  {
    href: "/batches",
    label: "���α�����",
    shortLabel: "����",
    description: "���ٱ����ڣ����ȴ����������Ρ�",
    permission: "batches",
    tone: "from-violet-500 via-fuchsia-500 to-pink-300"
  },
  {
    href: "/reports",
    label: "��������",
    shortLabel: "����",
    description: "�鿴��������⡢�������Ļ��ܡ�",
    permission: "reports",
    tone: "from-slate-700 via-slate-600 to-slate-400"
  },
  {
    href: "/users",
    label: "�û���Ȩ��",
    shortLabel: "Ȩ��",
    description: "����Ա�����ԱȨ�޺ͽ�ɫ��",
    permission: "users",
    tone: "from-neutral-800 via-stone-700 to-zinc-500"
  }
];
