import { AdminShell, DataTable, SectionCard } from "@/components/admin-shell";
import { outboundRecords } from "@/lib/mock-data";
import { requirePageUser } from "@/lib/session";

export default async function OutboundPage() {
  await requirePageUser();

  return (
    <AdminShell title="出库管理" description="管理门店调拨、订单拣货和整批出库。" currentPath="/outbound" actions={<button className="rounded-lg bg-brand px-3 py-2 text-sm font-medium text-white">新建出库</button>}>
      <SectionCard title="出库记录">
        <DataTable
          columns={["单号", "水果", "批次", "数量", "操作人", "时间", "备注"]}
          rows={outboundRecords.map((item) => [
            item.id,
            item.fruitName,
            item.batchNo,
            `${item.quantity} ${item.unit}`,
            item.operator,
            item.date,
            item.note
          ])}
        />
      </SectionCard>
    </AdminShell>
  );
}