import { getSessionUser } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await getSessionUser();
  redirect(session ? "/dashboard" : "/login");
}