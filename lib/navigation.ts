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
    label: "仪表盘",
    shortLabel: "总览",
    description: "查看库存趋势、预警和今日关键数据。",
    permission: "dashboard",
    tone: "from-sky-500 via-cyan-500 to-teal-400"
  },
  {
    href: "/inventory",
    label: "库存管理",
    shortLabel: "库存",
    description: "维护商品资料、库存数量和图片详情。",
    permission: "inventory",
    tone: "from-emerald-500 via-lime-500 to-amber-300"
  },
  {
    href: "/inbound",
    label: "入库管理",
    shortLabel: "入库",
    description: "登记到货、批次和新增商品入库。",
    permission: "inbound",
    tone: "from-orange-500 via-amber-500 to-yellow-300"
  },
  {
    href: "/outbound",
    label: "出库管理",
    shortLabel: "出库",
    description: "处理出库扣减、调拨和发货。",
    permission: "outbound",
    tone: "from-indigo-500 via-blue-500 to-cyan-400"
  },
  {
    href: "/reports",
    label: "报表中心",
    shortLabel: "报表",
    description: "查看库存金额、日库存和月度变化。",
    permission: "reports",
    tone: "from-slate-700 via-slate-600 to-slate-400"
  },
  {
    href: "/users",
    label: "用户与权限",
    shortLabel: "权限",
    description: "管理员分配成员权限和角色。",
    permission: "users",
    tone: "from-neutral-800 via-stone-700 to-zinc-500"
  }
];