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
          <div className="grid gap-6 px-6 py-8 lg:grid-cols-[1.3fr_0.7fr] lg:px-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Fruit System</p>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 md:text-5xl">{"\u6c34\u679c\u4ed3\u5e93\u7cfb\u7edf\u9996\u9875"}</h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
                {"\u8fd9\u91cc\u96c6\u4e2d\u5c55\u793a\u6574\u4e2a\u7cfb\u7edf\u7684\u64cd\u4f5c\u5165\u53e3\u3002\u7ba1\u7406\u5458\u5177\u5907\u5168\u90e8\u6743\u9650\uff0c\u6210\u5458\u6839\u636e\u6388\u6743\u8fdb\u5165\u5bf9\u5e94\u6a21\u5757\u5904\u7406\u5e93\u5b58\u3001\u6279\u6b21\u548c\u4e1a\u52a1\u6570\u636e\u3002"}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <div className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white">{`${currentUser.displayName} · ${currentUser.userTypeLabel}`}</div>
                <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600">{`\u8d26\u53f7\uff1a${currentUser.username}`}</div>
                <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600">{`\u624b\u673a\uff1a${currentUser.phone || "\u672a\u7ed1\u5b9a"}`}</div>
              </div>
            </div>
            <div className="rounded-[28px] bg-slate-900 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-300">{"\u5feb\u901f\u5165\u53e3"}</p>
                  <h2 className="mt-2 text-2xl font-semibold">{"\u8d26\u6237\u4e0e\u5e38\u7528\u529f\u80fd"}</h2>
                </div>
                <div className="h-16 w-16 rounded-full bg-white/10" />
              </div>
              <div className="mt-6 space-y-3 text-sm text-slate-200">
                <Link href="/account" className="block rounded-2xl border border-white/10 px-4 py-3 transition hover:bg-white/10">{"\u4fee\u6539\u5bc6\u7801\u4e0e\u67e5\u770b\u4e2a\u4eba\u8d44\u6599"}</Link>
                {currentUser.permissions.users ? <Link href="/users" className="block rounded-2xl border border-white/10 px-4 py-3 transition hover:bg-white/10">{"\u7ba1\u7406\u6210\u5458\u8d26\u53f7\u4e0e\u6743\u9650"}</Link> : null}
                <LogoutButton />
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
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
        </section>
      </div>
    </main>
  );
}
