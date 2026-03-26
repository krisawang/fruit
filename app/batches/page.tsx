import { AdminShell } from "@/components/admin-shell";
import { DataTable, SectionCard } from "@/components/ui-shell";
import { inventoryItems } from "@/lib/mock-data";
import { requirePageUser } from "@/lib/session";

export default async function BatchesPage() {
  await requirePageUser("batches");

  return (
    <AdminShell title="\u6279\u6b21\u4fdd\u8d28\u671f" description="\u805a\u7126\u4e34\u671f\u5e93\u5b58\uff0c\u65b9\u4fbf\u5148\u8fdb\u5148\u51fa\u548c\u9884\u8b66\u5904\u7406\u3002" currentPath="/batches">
      <SectionCard title="\u6279\u6b21\u4e0e\u4fdd\u8d28\u671f" extra={<span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">\u91cd\u70b9\u5173\u6ce8\u4e34\u671f\u6279\u6b21</span>}>
        <DataTable
          columns={["\u6c34\u679c", "\u6279\u6b21", "\u5165\u5e93\u65e5\u671f", "\u5230\u671f\u65e5\u671f", "\u5269\u4f59\u5e93\u5b58", "\u4ed3\u4f4d", "\u72b6\u6001"]}
          rows={inventoryItems.map((item) => [item.name, item.batchNo, item.inboundDate, item.expiryDate, `${item.quantity} ${item.unit}`, item.warehouseLocation, item.status])}
        />
      </SectionCard>
    </AdminShell>
  );
}
