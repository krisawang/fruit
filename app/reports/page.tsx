import { AdminShell } from "@/components/admin-shell";
import { ReportsCenter } from "@/components/reports-center";
import { requirePageUser } from "@/lib/session";

export default async function ReportsPage() {
  await requirePageUser("reports");

  return (
    <AdminShell title={"\u62a5\u8868\u4e2d\u5fc3"} description={"\u67e5\u770b\u5e93\u5b58\u3001\u51fa\u5165\u5e93\u3001\u635f\u8017\u53d8\u5316\uff0c\u5e76\u5bfc\u51fa Excel \u62a5\u8868\u3002"} currentPath="/reports">
      <ReportsCenter />
    </AdminShell>
  );
}