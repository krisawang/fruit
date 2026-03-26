import { AdminShell } from "@/components/admin-shell";
import { DataTable, SectionCard } from "@/components/ui-shell";
import { lossRecords } from "@/lib/mock-data";
import { requirePageUser } from "@/lib/session";

export default async function LossPage() {
  await requirePageUser("loss");

  return (
    <AdminShell title="\u635f\u8017\u767b\u8bb0" description="\u767b\u8bb0\u8150\u635f\u3001\u6324\u538b\u548c\u4e34\u671f\u5904\u7406\u7b49\u635f\u8017\u4fe1\u606f\u3002" currentPath="/loss" actions={<button className="rounded-lg bg-rose-600 px-3 py-2 text-sm font-medium text-white">\u767b\u8bb0\u635f\u8017</button>}>
      <SectionCard title="\u635f\u8017\u8bb0\u5f55">
        <DataTable columns={["\u5355\u53f7", "\u6c34\u679c", "\u6279\u6b21", "\u6570\u91cf", "\u64cd\u4f5c\u4eba", "\u65f6\u95f4", "\u539f\u56e0"]} rows={lossRecords.map((item) => [item.id, item.fruitName, item.batchNo, `${item.quantity} ${item.unit}`, item.operator, item.date, item.note])} />
      </SectionCard>
    </AdminShell>
  );
}
