import { AdminShell } from "@/components/admin-shell";
import { DataTable, SectionCard, StatCard } from "@/components/ui-shell";
import { dashboardStats, inboundRecords, inventoryItems, lossRecords } from "@/lib/mock-data";
import { requirePageUser } from "@/lib/session";

export default async function DashboardPage() {
  await requirePageUser("dashboard");

  return (
    <AdminShell title="\u4eea\u8868\u76d8" description="\u67e5\u770b\u5e93\u5b58\u603b\u89c8\u3001\u51fa\u5165\u5e93\u52a8\u6001\u548c\u5f02\u5e38\u9884\u8b66\u3002" currentPath="/dashboard">
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <StatCard label="\u5f53\u524d\u5e93\u5b58\u603b\u91cf" value={`${dashboardStats.totalInventory.toLocaleString()} kg`} hint="\u5168\u90e8\u5728\u5e93\u6c34\u679c\u6298\u7b97\u91cd\u91cf" />
          <StatCard label="\u4eca\u65e5\u5165\u5e93" value={`${dashboardStats.todayInbound.toLocaleString()} kg`} hint="\u4eca\u65e5\u5df2\u5b8c\u6210\u5165\u5e93\u91cf" />
          <StatCard label="\u4eca\u65e5\u51fa\u5e93" value={`${dashboardStats.todayOutbound.toLocaleString()} kg`} hint="\u4eca\u65e5\u5df2\u5b8c\u6210\u51fa\u5e93\u91cf" />
          <StatCard label="\u5373\u5c06\u8fc7\u671f\u6570\u91cf" value={`${dashboardStats.expiringSoon.toLocaleString()} kg`} hint="7 \u65e5\u5185\u5230\u671f\u6279\u6b21" />
          <StatCard label="\u4f4e\u5e93\u5b58\u9884\u8b66" value={`${dashboardStats.lowStock} \u9879`} hint="\u9700\u8981\u8865\u8d27\u6216\u8c03\u6574" />
          <StatCard label="\u4eca\u65e5\u635f\u8017\u6570\u91cf" value={`${dashboardStats.todayLoss} kg`} hint="\u5df2\u767b\u8bb0\u635f\u8017" />
        </div>
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
          <SectionCard title="\u5e93\u5b58\u72b6\u6001\u6982\u89c8">
            <DataTable columns={["\u6c34\u679c", "\u5206\u7c7b", "\u6279\u6b21", "\u5e93\u5b58", "\u4ed3\u4f4d", "\u4fdd\u8d28\u671f", "\u72b6\u6001"]} rows={inventoryItems.slice(0, 5).map((item) => [item.name, item.category, item.batchNo, `${item.quantity} ${item.unit}`, item.warehouseLocation, item.expiryDate, item.status])} />
          </SectionCard>
          <SectionCard title="\u4eca\u65e5\u52a8\u6001">
            <div className="space-y-5">
              <div>
                <p className="mb-3 text-sm font-medium text-slate-700">\u6700\u65b0\u5165\u5e93</p>
                <ul className="space-y-3 text-sm text-slate-600">
                  {inboundRecords.map((record) => (
                    <li key={record.id} className="rounded-xl bg-slate-50 px-4 py-3">
                      <div className="font-medium text-slate-900">{record.fruitName}</div>
                      <div>{`${record.quantity} ${record.unit} · ${record.date}`}</div>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mb-3 text-sm font-medium text-slate-700">\u4eca\u65e5\u635f\u8017</p>
                <ul className="space-y-3 text-sm text-slate-600">
                  {lossRecords.map((record) => (
                    <li key={record.id} className="rounded-xl bg-rose-50 px-4 py-3">
                      <div className="font-medium text-slate-900">{record.fruitName}</div>
                      <div>{`${record.quantity} ${record.unit} · ${record.note}`}</div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </AdminShell>
  );
}
