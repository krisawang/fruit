import { AdminShell } from "@/components/admin-shell";
import { InventoryManagement } from "@/components/inventory-management";
import { requirePageUser } from "@/lib/session";

export default async function InventoryPage() {
  await requirePageUser();

  return (
    <AdminShell title="库存管理" description="查看商品资料、库存信息，并完成新增和编辑。" currentPath="/inventory">
      <InventoryManagement />
    </AdminShell>
  );
}
