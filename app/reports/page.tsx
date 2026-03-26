import { AdminShell, SectionCard, StatCard } from "@/components/admin-shell";
import { dashboardStats, reportRows } from "@/lib/mock-data";
import { requirePageUser } from "@/lib/session";

export default async function ReportsPage() {
  await requirePageUser();

  return (
    <AdminShell title="报表中心" description="查看库存、损耗和周转相关指标。" currentPath="/reports">
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="库存总量" value={`${dashboardStats.totalInventory.toLocaleString()} kg`} hint="当前账面库存" />
          <StatCard label="临期总量" value={`${dashboardStats.expiringSoon.toLocaleString()} kg`} hint="建议优先出库" />
          <StatCard label="低库存项" value={`${dashboardStats.lowStock}`} hint="需触发补货" />
          <StatCard label="当日损耗" value={`${dashboardStats.todayLoss} kg`} hint="用于追踪损耗率" />
        </div>
        <SectionCard title="经营指标">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {reportRows.map((row) => (
              <div key={row.label} className="rounded-2xl bg-slate-50 p-5">
                <p className="text-sm text-slate-500">{row.label}</p>
                <p className="mt-3 text-2xl font-semibold text-slate-900">{row.value}</p>
                <p className="mt-2 text-xs text-emerald-600">{row.trend}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </AdminShell>
  );
}