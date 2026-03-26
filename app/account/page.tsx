import { AdminShell } from "@/components/admin-shell";
import { AccountSettings } from "@/components/account-settings";
import { requirePageUser } from "@/lib/session";

export default async function AccountPage() {
  const currentUser = await requirePageUser();

  return (
    <AdminShell title="�˻�����" description="�鿴�������ϲ��޸ĵ�¼���롣" currentPath="/account">
      <AccountSettings profile={currentUser} />
    </AdminShell>
  );
}
