import { AdminShell, DataTable, SectionCard } from "@/components/admin-shell";
import { inventoryItems } from "@/lib/mock-data";
import { requirePageUser } from "@/lib/session";

export default async function BatchesPage() {
  await requirePageUser();

  return (
    <AdminShell title="批次保质期" description="聚焦临期库存，方便先入先出和预警处理。" currentPath="/batches">
      <SectionCard title="批次与保质期" extra={<span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">重点关注临期批次</span>}>
        <DataTable
          columns={["水果", "批次", "入库日期", "到期日期", "剩余库存", "库位", "状态"]}
          rows={inventoryItems.map((item) => [
            item.name,
            item.batchNo,
            item.inboundDate,
            item.expiryDate,
            `${item.quantity} ${item.unit}`,
            item.warehouseLocation,
            item.status
          ])}
        />
      </SectionCard>
    </AdminShell>
  );
}