import { ok, fail } from "@/lib/api";
import { requireApiUser } from "@/lib/session";

export async function GET() {
  try {
    const user = await requireApiUser();
    return ok(user);
  } catch (error) {
    return fail(error);
  }
}
