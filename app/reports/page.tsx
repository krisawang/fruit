import { AdminShell } from "@/components/admin-shell";
import { SectionCard, StatCard } from "@/components/ui-shell";
import { dashboardStats, reportRows } from "@/lib/mock-data";
import { requirePageUser } from "@/lib/session";

export default async function ReportsPage() {
  await requirePageUser("reports");

  return (
    <AdminShell title="Reports" description="View inventory, loss, and turnover indicators." currentPath="/reports">
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Inventory Total" value={`${dashboardStats.totalInventory.toLocaleString()} kg`} hint="Current on-hand inventory" />
          <StatCard label="Expiring Soon" value={`${dashboardStats.expiringSoon.toLocaleString()} kg`} hint="Prioritize outbound handling" />
          <StatCard label="Low Stock Items" value={`${dashboardStats.lowStock}`} hint="Needs replenishment" />
          <StatCard label="Today Loss" value={`${dashboardStats.todayLoss} kg`} hint="Used to track shrinkage" />
        </div>
        <SectionCard title="Operating Metrics">
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
