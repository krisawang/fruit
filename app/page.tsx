import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { serializeFruitItem } from "@/lib/inventory";
import { requirePageUser } from "@/lib/session";
import { LogoutButton } from "@/components/logout-button";

export default async function HomePage() {
  const currentUser = await requirePageUser();
  const selectedItems = await prisma.fruitItem.findMany({
    where: { showOnHome: true },
    orderBy: [{ updatedAt: "desc" }],
    take: 8
  });

  const fallbackItems = selectedItems.length === 0 ? await prisma.fruitItem.findMany({ orderBy: [{ updatedAt: "desc" }], take: 12 }) : [];
  const showcaseItems = (selectedItems.length > 0 ? selectedItems : fallbackItems)
    .map(serializeFruitItem)
    .filter((item) => item.mainImages.length > 0 || item.mainImage)
    .slice(0, 8);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.08),_transparent_38%),linear-gradient(180deg,#f8fafc_0%,#e2e8f0_100%)] px-4 py-8 md:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
          <div className="px-6 py-8 lg:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Fruit System</p>
            <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-5xl">{"\u6c34\u679c\u9996\u9875\u5c55\u793a"}</h1>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 md:text-base">
                  {"\u9996\u9875\u4e0d\u518d\u653e\u4e1a\u52a1\u5165\u53e3\u5361\u7247\uff0c\u4e1a\u52a1\u64cd\u4f5c\u7edf\u4e00\u901a\u8fc7\u5de6\u4fa7\u8fb9\u680f\u8fdb\u5165\u3002\u8fd9\u91cc\u5c55\u793a\u4f60\u5728\u5e93\u5b58\u7ba1\u7406\u91cc\u52fe\u9009\u201c\u9996\u9875\u5c55\u793a\u201d\u7684\u6c34\u679c\uff0c\u5e76\u4f18\u5148\u4f7f\u7528\u4e0a\u4f20\u7684\u4e3b\u56fe\u3002"}
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
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">{"\u6c34\u679c\u5c55\u793a"}</h2>
              <p className="mt-1 text-sm text-slate-500">{"\u5728\u5e93\u5b58\u7ba1\u7406\u4e2d\u4e0a\u4f20\u4e3b\u56fe\u3001\u8bbe\u7f6e\u5c01\u9762\uff0c\u5e76\u52fe\u9009\u201c\u9996\u9875\u5c55\u793a\u201d\u540e\uff0c\u8fd9\u91cc\u4f1a\u540c\u6b65\u66f4\u65b0\u3002"}</p>
            </div>
            <Link href="/inventory" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">{"\u524d\u5f80\u5e93\u5b58\u7ba1\u7406"}</Link>
          </div>

          {showcaseItems.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {showcaseItems.map((item) => {
                const cover = item.mainImage ?? item.mainImages[0] ?? null;
                return (
                  <article key={item.id} className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
                    <div className="aspect-[4/3] bg-slate-100">
                      {cover ? <img src={cover} alt={item.name} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-sm text-slate-400">{"\u6682\u65e0\u56fe\u7247"}</div>}
                    </div>
                    <div className="space-y-3 px-5 py-5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900">{item.name}</h3>
                          <p className="mt-1 text-sm text-slate-500">{`${item.brand || "\u7cbe\u9009\u6c34\u679c"} · ${item.origin}`}</p>
                        </div>
                        <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white">{item.packageTypeLabel}</span>
                      </div>
                      <p className="line-clamp-2 text-sm leading-6 text-slate-600">{item.detailContent || "\u5df2\u4e0a\u4f20\u56fe\u7247\uff0c\u53ef\u5728\u5e93\u5b58\u7ba1\u7406\u4e2d\u7ee7\u7eed\u7ef4\u62a4\u8be6\u60c5\u8bf4\u660e\u3002"}</p>
                      <div className="flex items-center justify-between text-sm text-slate-500">
                        <span>{`\u5e93\u5b58\uff1a${item.quantity} ${item.unit}`}</span>
                        <span>{item.price == null ? "\u4ef7\u683c\u5f85\u8bbe\u7f6e" : `¥${item.price.toFixed(2)}`}</span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="rounded-[28px] border border-dashed border-slate-300 bg-white px-6 py-16 text-center text-sm text-slate-500">
              {"\u8fd8\u6ca1\u6709\u53ef\u5c55\u793a\u7684\u6c34\u679c\u3002\u8bf7\u5148\u5230\u5e93\u5b58\u7ba1\u7406\u4e0a\u4f20\u4e3b\u56fe\uff0c\u5e76\u52fe\u9009\u201c\u9996\u9875\u5c55\u793a\u201d\u3002"}
            </div>
          )}
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
                ? "\u7ba1\u7406\u5458\u53ef\u4ee5\u5728\u8fd9\u91cc\u67e5\u770b\u6210\u5458\u4fe1\u606f\u3001\u8c03\u6574\u89d2\u8272\u548c\u7ec6\u5316\u4e1a\u52a1\u6743\u9650\u3002"
                : "\u5f53\u524d\u8d26\u53f7\u4e0d\u662f\u7ba1\u7406\u5458\uff0c\u6210\u5458\u6743\u9650\u4e0e\u5176\u4ed6\u8d26\u6237\u7ba1\u7406\u5165\u53e3\u7531\u7ba1\u7406\u5458\u7edf\u4e00\u914d\u7f6e\u3002"}
            </p>
            <div className="mt-6 space-y-3">
              {currentUser.isAdmin ? (
                <Link href="/users" className="block rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100">{"\u8fdb\u5165\u6210\u5458\u4e0e\u6743\u9650\u7ba1\u7406"}</Link>
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