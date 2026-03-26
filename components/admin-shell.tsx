import type { ReactNode } from "react";
import Link from "next/link";
import { moduleEntries } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { requirePageUser } from "@/lib/session";
import { LogoutButton } from "@/components/logout-button";

export async function AdminShell({
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
  const currentUser = await requirePageUser();
  const navItems = moduleEntries.filter((item) => currentUser.permissions[item.permission]);

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="grid min-h-screen lg:grid-cols-[240px_1fr]">
        <aside className="border-r border-slate-200 bg-white px-5 py-6">
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Fruit System</p>
            <Link href="/" className="mt-2 block text-xl font-semibold text-slate-900">
              {"\u6c34\u679c\u4ed3\u5e93\u540e\u53f0"}
            </Link>
          </div>
          <nav className="flex flex-col gap-1">
            <Link href="/" className={cn("rounded-lg px-3 py-2 text-sm font-medium transition", currentPath === "/" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900")}>
              {"\u9996\u9875\u5165\u53e3"}
            </Link>
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className={cn("rounded-lg px-3 py-2 text-sm font-medium transition", currentPath === item.href ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900")}>
                {item.label}
              </Link>
            ))}
            <Link href="/account" className={cn("rounded-lg px-3 py-2 text-sm font-medium transition", currentPath === "/account" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900")}>
              {"\u8d26\u6237\u8bbe\u7f6e"}
            </Link>
          </nav>
        </aside>
        <div className="flex min-h-screen flex-col">
          <header className="flex flex-col gap-4 border-b border-slate-200 bg-white px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
              <p className="mt-1 text-sm text-slate-500">{description}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {actions}
              <Link href="/account" className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-100">
                {`${currentUser.displayName} · ${currentUser.userTypeLabel}`}
              </Link>
              <LogoutButton />
            </div>
          </header>
          <main className="flex-1 px-6 py-6">{children}</main>
        </div>
      </div>
    </div>
  );
}