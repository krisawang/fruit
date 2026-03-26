import { AdminShell, DataTable, SectionCard, StatCard } from "@/components/admin-shell";
import { dashboardStats, inboundRecords, inventoryItems, lossRecords } from "@/lib/mock-data";
import { requirePageUser } from "@/lib/session";

export default async function DashboardPage() {
  await requirePageUser();

  return (
    <AdminShell title="仪表盘" description="查看库存总览、出入库动态和异常预警。" currentPath="/dashboard">
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <StatCard label="当前库存总量" value={`${dashboardStats.totalInventory.toLocaleString()} kg`} hint="全部在库水果折算重量" />
          <StatCard label="今日入库" value={`${dashboardStats.todayInbound.toLocaleString()} kg`} hint="今日已完成入库" />
          <StatCard label="今日出库" value={`${dashboardStats.todayOutbound.toLocaleString()} kg`} hint="今日已完成出库" />
          <StatCard label="即将过期数量" value={`${dashboardStats.expiringSoon.toLocaleString()} kg`} hint="7 日内到期批次" />
          <StatCard label="低库存预警数量" value={`${dashboardStats.lowStock} 项`} hint="需补货或调拨" />
          <StatCard label="今日损耗数量" value={`${dashboardStats.todayLoss} kg`} hint="已登记损耗" />
        </div>
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
          <SectionCard title="库存状态概览">
            <DataTable
              columns={["水果", "分类", "批次", "库存", "库位", "保质期", "状态"]}
              rows={inventoryItems.slice(0, 5).map((item) => [
                item.name,
                item.category,
                item.batchNo,
                `${item.quantity} ${item.unit}`,
                item.warehouseLocation,
                item.expiryDate,
                item.status
              ])}
            />
          </SectionCard>
          <SectionCard title="今日动态">
            <div className="space-y-5">
              <div>
                <p className="mb-3 text-sm font-medium text-slate-700">最新入库</p>
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
                <p className="mb-3 text-sm font-medium text-slate-700">今日损耗</p>
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