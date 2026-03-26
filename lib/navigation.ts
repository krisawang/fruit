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
    description: "\u7ef4\u62a4\u6c34\u679c\u8d44\u6599\u3001\u5e93\u5b58\u6570\u91cf\u3001\u56fe\u7247\u548c\u9996\u9875\u5c55\u793a\u5185\u5bb9\u3002",
    permission: "inventory",
    tone: "from-emerald-500 via-lime-500 to-amber-300"
  },
  {
    href: "/inbound",
    label: "\u5165\u5e93\u7ba1\u7406",
    shortLabel: "\u5165\u5e93",
    description: "\u767b\u8bb0\u5230\u8d27\u3001\u6279\u6b21\u548c\u65b0\u589e\u6c34\u679c\u5165\u5e93\u3002",
    permission: "inbound",
    tone: "from-orange-500 via-amber-500 to-yellow-300"
  },
  {
    href: "/outbound",
    label: "\u51fa\u5e93\u7ba1\u7406",
    shortLabel: "\u51fa\u5e93",
    description: "\u5904\u7406\u51fa\u5e93\u6263\u51cf\u3001\u8c03\u62e8\u548c\u53d1\u8d27\u8bb0\u5f55\u3002",
    permission: "outbound",
    tone: "from-indigo-500 via-blue-500 to-cyan-400"
  },
  {
    href: "/reports",
    label: "\u62a5\u8868\u4e2d\u5fc3",
    shortLabel: "\u62a5\u8868",
    description: "\u67e5\u770b\u5e93\u5b58\u91d1\u989d\u3001\u65e5\u5e93\u5b58\u548c\u6708\u5ea6\u53d8\u5316\u62a5\u8868\u3002",
    permission: "reports",
    tone: "from-slate-700 via-slate-600 to-slate-400"
  },
  {
    href: "/users",
    label: "\u7528\u6237\u4e0e\u6743\u9650",
    shortLabel: "\u6743\u9650",
    description: "\u7ba1\u7406\u5458\u7ef4\u62a4\u6210\u5458\u8d26\u53f7\u3001\u89d2\u8272\u548c\u6a21\u5757\u6743\u9650\u3002",
    permission: "users",
    tone: "from-neutral-800 via-stone-700 to-zinc-500"
  }
];