import { AdminShell, DataTable, SectionCard } from "@/components/admin-shell";
import { lossRecords } from "@/lib/mock-data";
import { requirePageUser } from "@/lib/session";

export default async function LossPage() {
  await requirePageUser();

  return (
    <AdminShell title="损耗登记" description="登记腐损、挤压和临期处理等损耗信息。" currentPath="/loss" actions={<button className="rounded-lg bg-rose-600 px-3 py-2 text-sm font-medium text-white">登记损耗</button>}>
      <SectionCard title="损耗记录">
        <DataTable
          columns={["单号", "水果", "批次", "数量", "操作人", "时间", "原因"]}
          rows={lossRecords.map((item) => [
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