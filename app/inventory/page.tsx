import { AdminShell } from "@/components/admin-shell";
import { InventoryManagement } from "@/components/inventory-management";
import { requirePageUser } from "@/lib/session";

export default async function InventoryPage() {
  await requirePageUser("inventory");

  return (
    <AdminShell title={"\u5e93\u5b58\u7ba1\u7406"} description={"\u67e5\u770b\u5546\u54c1\u8d44\u6599\u3001\u5e93\u5b58\u4fe1\u606f\uff0c\u5e76\u5b8c\u6210\u65b0\u589e\u3001\u7f16\u8f91\u548c\u672c\u5730\u56fe\u7247\u4e0a\u4f20\u3002"} currentPath="/inventory">
      <InventoryManagement />
    </AdminShell>
  );
}
