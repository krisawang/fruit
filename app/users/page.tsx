import { AdminShell } from "@/components/admin-shell";
import { UserManagement } from "@/components/user-management";
import { requirePageUser } from "@/lib/session";

export default async function UsersPage() {
  await requirePageUser("users");

  return (
    <AdminShell title={"\u7528\u6237\u4e0e\u6743\u9650"} description={"\u7ba1\u7406\u5458\u53ef\u4ee5\u7ef4\u62a4\u6210\u5458\u8d26\u53f7\u5e76\u5206\u914d\u5404\u6a21\u5757\u8bbf\u95ee\u80fd\u529b\u3002"} currentPath="/users">
      <UserManagement />
    </AdminShell>
  );
}
