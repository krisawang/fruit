import type { Route } from "next";
import Link from "next/link";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

const navItems: Array<{ href: Route; label: string }> = [
  { href: "/dashboard", label: "仪表盘" },
  { href: "/inventory", label: "库存管理" },
  { href: "/inbound", label: "入库管理" },
  { href: "/outbound", label: "出库管理" },
  { href: "/loss", label: "损耗登记" },
  { href: "/batches", label: "批次保质期" },
  { href: "/reports", label: "报表中心" }
];

export function AdminShell({
  title,
  description,
  currentPath,
  actions,
  children
}: {
  title: string;
  description: string;
  currentPath: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-100">
      <div className="grid min-h-screen lg:grid-cols-[240px_1fr]">
        <aside className="border-r border-slate-200 bg-white px-5 py-6">
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Fruit System</p>
            <h1 className="mt-2 text-xl font-semibold text-slate-900">水果仓管后台</h1>
          </div>
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition",
                  currentPath === item.href
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <div className="flex min-h-screen flex-col">
          <header className="flex flex-col gap-4 border-b border-slate-200 bg-white px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
              <p className="mt-1 text-sm text-slate-500">{description}</p>
            </div>
            <div className="flex items-center gap-3">
              {actions}
              <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600">仓库管理员 / Demo</div>
            </div>
          </header>
          <main className="flex-1 px-6 py-6">{children}</main>
        </div>
      </div>
    </div>
  );
}

export function StatCard({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-slate-900">{value}</p>
      <p className="mt-2 text-xs text-slate-400">{hint}</p>
    </div>
  );
}

export function SectionCard({ title, extra, children }: { title: string; extra?: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
        {extra}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

export function DataTable({ columns, rows }: { columns: string[]; rows: ReactNode[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-slate-500">
            {columns.map((column) => (
              <th key={column} className="px-3 py-3 font-medium">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="border-b border-slate-100 last:border-b-0">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-3 py-3 text-slate-700">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}