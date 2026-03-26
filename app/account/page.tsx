import { AdminShell } from "@/components/admin-shell";
import { AccountSettings } from "@/components/account-settings";
import { requirePageUser } from "@/lib/session";

export default async function AccountPage() {
  const currentUser = await requirePageUser();

  return (
    <AdminShell title={"\u8d26\u6237\u8bbe\u7f6e"} description={"\u67e5\u770b\u4e2a\u4eba\u8d44\u6599\u5e76\u4fee\u6539\u767b\u5f55\u5bc6\u7801\u3002"} currentPath="/account">
      <AccountSettings profile={currentUser} />
    </AdminShell>
  );
}
