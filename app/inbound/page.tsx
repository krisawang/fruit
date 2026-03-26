import { AdminShell } from "@/components/admin-shell";
import { DataTable, SectionCard } from "@/components/ui-shell";
import { inboundRecords } from "@/lib/mock-data";
import { requirePageUser } from "@/lib/session";

export default async function InboundPage() {
  await requirePageUser("inbound");

  return (
    <AdminShell title="\u5165\u5e93\u7ba1\u7406" description="\u8bb0\u5f55\u5230\u8d27\u3001\u4e0a\u67b6\u548c\u6279\u6b21\u5165\u5e93\u4fe1\u606f\u3002" currentPath="/inbound" actions={<button className="rounded-lg bg-brand px-3 py-2 text-sm font-medium text-white">\u65b0\u5efa\u5165\u5e93</button>}>
      <SectionCard title="\u5165\u5e93\u8bb0\u5f55">
        <DataTable columns={["\u5355\u53f7", "\u6c34\u679c", "\u6279\u6b21", "\u6570\u91cf", "\u64cd\u4f5c\u4eba", "\u65f6\u95f4", "\u5907\u6ce8"]} rows={inboundRecords.map((item) => [item.id, item.fruitName, item.batchNo, `${item.quantity} ${item.unit}`, item.operator, item.date, item.note])} />
      </SectionCard>
    </AdminShell>
  );
}
