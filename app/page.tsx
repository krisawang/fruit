import Link from "next/link";
import { moduleEntries } from "@/lib/navigation";
import { requirePageUser } from "@/lib/session";
import { LogoutButton } from "@/components/logout-button";

export default async function HomePage() {
  const currentUser = await requirePageUser();
  const availableModules = moduleEntries.filter((item) => currentUser.permissions[item.permission]);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.08),_transparent_38%),linear-gradient(180deg,#f8fafc_0%,#e2e8f0_100%)] px-4 py-8 md:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
          <div className="px-6 py-8 lg:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Fruit System</p>
            <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-5xl">{"\u6c34\u679c\u4ed3\u5e93\u7cfb\u7edf\u9996\u9875"}</h1>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 md:text-base">
                  {"\u4e1a\u52a1\u6a21\u5757\u96c6\u4e2d\u653e\u5728\u4e0a\u65b9\uff0c\u4fbf\u4e8e\u5feb\u901f\u8fdb\u5165\u5e93\u5b58\u3001\u51fa\u5165\u5e93\u3001\u6279\u6b21\u548c\u62a5\u8868\u9875\u9762\u3002\u7ba1\u7406\u5458\u7684\u8d26\u6237\u7ba1\u7406\u4e0e\u6210\u5458\u7ba1\u7406\u653e\u5728\u4e0b\u65b9\u5355\u72ec\u533a\u57df\uff0c\u907f\u514d\u9996\u9875\u5165\u53e3\u6df7\u6742\u3002"}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white">{`${currentUser.displayName} · ${currentUser.userTypeLabel}`}</div>
                <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600">{`\u8d26\u53f7\uff1a${currentUser.username}`}</div>
                <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600">{`\u624b\u673a\uff1a${currentUser.phone || "\u672a\u7ed1\u5b9a"}`}</div>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">{"\u4e1a\u52a1\u5165\u53e3"}</h2>
              <p className="mt-1 text-sm text-slate-500">{"\u70b9\u51fb\u5361\u7247\u8fdb\u5165\u5bf9\u5e94\u5b50\u9875\u9762\u64cd\u4f5c\u3002"}</p>
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {availableModules.map((item) => (
              <Link key={item.href} href={item.href} className="group relative overflow-hidden rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${item.tone}`} />
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className={`inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${item.tone} text-lg font-semibold text-white shadow-lg`}>{item.shortLabel}</div>
                    <h2 className="mt-5 text-2xl font-semibold text-slate-900">{item.label}</h2>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
                  </div>
                  <span className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-500 transition group-hover:border-slate-300 group-hover:text-slate-700">{"\u8fdb\u5165"}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Account</p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-900">{"\u8d26\u6237\u7ba1\u7406"}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">{"\u4fee\u6539\u7528\u6237\u540d\u3001\u59d3\u540d\u3001\u624b\u673a\u53f7\u548c\u767b\u5f55\u5bc6\u7801\uff0c\u7edf\u4e00\u5728\u4e2a\u4eba\u8d26\u6237\u9875\u4e2d\u5b8c\u6210\u3002"}</p>
            <div className="mt-6 space-y-3 text-sm text-slate-200">
              <Link href="/account" className="block rounded-2xl bg-slate-900 px-4 py-3 text-white transition hover:bg-slate-800">{"\u8fdb\u5165\u8d26\u6237\u8bbe\u7f6e"}</Link>
              <LogoutButton />
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Admin</p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-900">{"\u7ba1\u7406\u5458\u8d26\u6237\u7ba1\u7406"}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              {currentUser.isAdmin
                ? "\u7ba1\u7406\u5458\u53ef\u4ee5\u5728\u8fd9\u91cc\u67e5\u770b\u6210\u5458\u4fe1\u606f\u3001\u8c03\u6574\u89d2\u8272\u548c\u7ec6\u5316\u5404\u6a21\u5757\u6743\u9650\u3002"
                : "\u5f53\u524d\u8d26\u53f7\u4e0d\u662f\u7ba1\u7406\u5458\uff0c\u6210\u5458\u6743\u9650\u4e0e\u5176\u4ed6\u8d26\u6237\u7ba1\u7406\u5165\u53e3\u7531\u7ba1\u7406\u5458\u7edf\u4e00\u914d\u7f6e\u3002"}
            </p>
            <div className="mt-6 space-y-3">
              {currentUser.isAdmin ? (
                <Link href="/users" className="block rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
                  {"\u8fdb\u5165\u6210\u5458\u4e0e\u6743\u9650\u7ba1\u7406"}
                </Link>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-500">{"\u4ec5\u7ba1\u7406\u5458\u53ef\u8fdb\u5165\u6210\u5458\u7ba1\u7406\u9875\u9762\u3002"}</div>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}