import { AdminShell } from "@/components/admin-shell";
import { UserManagement } from "@/components/user-management";
import { requirePageUser } from "@/lib/session";

export default async function UsersPage() {
  await requirePageUser("users");

  return (
    <AdminShell title="�û���Ȩ��" description="����Ա����ά����Ա�˺Ų������ģ�����������" currentPath="/users">
      <UserManagement />
    </AdminShell>
  );
}
