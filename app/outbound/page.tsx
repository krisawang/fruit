import { AdminShell } from "@/components/admin-shell";
import { DataTable, SectionCard } from "@/components/ui-shell";
import { outboundRecords } from "@/lib/mock-data";
import { requirePageUser } from "@/lib/session";

export default async function OutboundPage() {
  await requirePageUser("outbound");

  return (
    <AdminShell title="\u51fa\u5e93\u7ba1\u7406" description="\u7ba1\u7406\u95e8\u5e97\u8c03\u62e8\u3001\u8ba2\u5355\u62e3\u8d27\u548c\u6574\u6279\u51fa\u5e93\u3002" currentPath="/outbound" actions={<button className="rounded-lg bg-brand px-3 py-2 text-sm font-medium text-white">\u65b0\u5efa\u51fa\u5e93</button>}>
      <SectionCard title="\u51fa\u5e93\u8bb0\u5f55">
        <DataTable columns={["\u5355\u53f7", "\u6c34\u679c", "\u6279\u6b21", "\u6570\u91cf", "\u64cd\u4f5c\u4eba", "\u65f6\u95f4", "\u5907\u6ce8"]} rows={outboundRecords.map((item) => [item.id, item.fruitName, item.batchNo, `${item.quantity} ${item.unit}`, item.operator, item.date, item.note])} />
      </SectionCard>
    </AdminShell>
  );
}
