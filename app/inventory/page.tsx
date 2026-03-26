import { AdminShell } from "@/components/admin-shell";
import { InventoryManagement } from "@/components/inventory-management";
import { requirePageUser } from "@/lib/session";

export default async function InventoryPage() {
  await requirePageUser("inventory");

  return (
    <AdminShell title="������" description="�鿴��Ʒ���ϡ������Ϣ��������������༭�ͱ���ͼƬ�ϴ���" currentPath="/inventory">
      <InventoryManagement />
    </AdminShell>
  );
}
