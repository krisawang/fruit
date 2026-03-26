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
    label: "\u4eea\u8868\u76d8",
    shortLabel: "\u603b\u89c8",
    description: "\u67e5\u770b\u5e93\u5b58\u8d8b\u52bf\u3001\u9884\u8b66\u548c\u4eca\u65e5\u5173\u952e\u6570\u636e\u3002",
    permission: "dashboard",
    tone: "from-sky-500 via-cyan-500 to-teal-400"
  },
  {
    href: "/inventory",
    label: "\u5e93\u5b58\u7ba1\u7406",
    shortLabel: "\u5e93\u5b58",
    description: "\u7ef4\u62a4\u5546\u54c1\u8d44\u6599\u3001\u5e93\u5b58\u6570\u91cf\u548c\u56fe\u7247\u8be6\u60c5\u3002",
    permission: "inventory",
    tone: "from-emerald-500 via-lime-500 to-amber-300"
  },
  {
    href: "/inbound",
    label: "\u5165\u5e93\u7ba1\u7406",
    shortLabel: "\u5165\u5e93",
    description: "\u767b\u8bb0\u5230\u8d27\u3001\u6279\u6b21\u548c\u65b0\u589e\u5546\u54c1\u5165\u5e93\u3002",
    permission: "inbound",
    tone: "from-orange-500 via-amber-500 to-yellow-300"
  },
  {
    href: "/outbound",
    label: "\u51fa\u5e93\u7ba1\u7406",
    shortLabel: "\u51fa\u5e93",
    description: "\u5904\u7406\u51fa\u5e93\u6263\u51cf\u3001\u8c03\u62e8\u548c\u53d1\u8d27\u3002",
    permission: "outbound",
    tone: "from-indigo-500 via-blue-500 to-cyan-400"
  },
  {
    href: "/loss",
    label: "\u635f\u8017\u767b\u8bb0",
    shortLabel: "\u635f\u8017",
    description: "\u767b\u8bb0\u8150\u635f\u3001\u62a5\u5e9f\u548c\u5f02\u5e38\u5e93\u5b58\u51cf\u5c11\u3002",
    permission: "loss",
    tone: "from-rose-500 via-pink-500 to-orange-300"
  },
  {
    href: "/batches",
    label: "\u6279\u6b21\u4fdd\u8d28\u671f",
    shortLabel: "\u6279\u6b21",
    description: "\u8ddf\u8e2a\u4fdd\u8d28\u671f\uff0c\u4f18\u5148\u5904\u7406\u4e34\u671f\u6279\u6b21\u3002",
    permission: "batches",
    tone: "from-violet-500 via-fuchsia-500 to-pink-300"
  },
  {
    href: "/reports",
    label: "\u62a5\u8868\u4e2d\u5fc3",
    shortLabel: "\u62a5\u8868",
    description: "\u67e5\u770b\u5468\u671f\u5185\u5165\u5e93\u3001\u51fa\u5e93\u548c\u635f\u8017\u6c47\u603b\u3002",
    permission: "reports",
    tone: "from-slate-700 via-slate-600 to-slate-400"
  },
  {
    href: "/users",
    label: "\u7528\u6237\u4e0e\u6743\u9650",
    shortLabel: "\u6743\u9650",
    description: "\u7ba1\u7406\u5458\u5206\u914d\u6210\u5458\u6743\u9650\u548c\u89d2\u8272\u3002",
    permission: "users",
    tone: "from-neutral-800 via-stone-700 to-zinc-500"
  }
];
