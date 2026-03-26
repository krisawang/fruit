import { AdminShell, DataTable, SectionCard } from "@/components/admin-shell";
import { inboundRecords } from "@/lib/mock-data";
import { requirePageUser } from "@/lib/session";

export default async function InboundPage() {
  await requirePageUser();

  return (
    <AdminShell title="入库管理" description="记录到货、上架和批次入库信息。" currentPath="/inbound" actions={<button className="rounded-lg bg-brand px-3 py-2 text-sm font-medium text-white">新建入库</button>}>
      <SectionCard title="入库记录">
        <DataTable
          columns={["单号", "水果", "批次", "数量", "操作人", "时间", "备注"]}
          rows={inboundRecords.map((item) => [
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